import { useEffect, useState } from 'react';
import { fetchDeletedLeadsByClientId, restoreDeletedLead, deleteLeadPermanently } from '@/utils/deletedLeadApi';
import { toast } from 'react-toastify';
import Sidebar from '@/src/components/organism/Sidebar';
import DashboardHeader from '@/src/components/organism/DashboardHeader';
import EmptyFilter from '@/src/components/organism/LeadVault/EmptyLeadPage';
import { faChevronLeft, faChevronRight, faDownload, faArchive, faFlag } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import withAuthorization from '@/utils/withAuthorization';
import Popup from '@/src/components/organism/Popup';
import ArchivedNotifiy from '@/src/components/organism/LeadVault/ArchivedNotifiy';

function DeletedLeadsPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 20;
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmActionType, setConfirmActionType] = useState(null); // 'restore' or 'delete'
  const [deleteLeadId, setDeleteLeadId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);


  const fetchDeletedLeads = async () => {
    try {
      setLoading(true);
      const { deletedLeads, total } = await fetchDeletedLeadsByClientId(page, pageSize);
      const mappedLeads = deletedLeads.map(item => ({
        ...item.data,
        deletedLeadId: item._id,
      }));

      const uniqueLeads = Array.from(
        new Map(mappedLeads.map(lead => [lead.deletedLeadId, lead])).values()
      );

      setLeads(uniqueLeads);
      setTotal(total);
    } catch (error) {
      toast.error("Failed to load leads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeletedLeads();
  }, [page]);

  const handleConfirmedAction = async () => {
    try {
      if (confirmActionType === 'restore') {
        await Promise.all(selected.map(id => restoreDeletedLead(id)));
        toast.success(`${selected.length} lead(s) restored successfully.`);
      }

      setSelected([]);
      setLeads(prev => prev.filter(lead => !selected.includes(lead._id)));
      setTotal(prev => prev - selected.length);
      fetchDeletedLeads();
    } catch (error) {
      toast.error("Failed to perform action.");
    } finally {
      setIsConfirmModalOpen(false);
    }
  };

  const handlePermanentDelete = async () => {
    try {
      await deleteLeadPermanently(deleteLeadId);
      toast.success("Lead permanently deleted.");

      setLeads(prev => prev.filter(lead => lead.deletedLeadId !== deleteLeadId));
      setTotal(prev => prev - 1);
    } catch (err) {
      toast.error("Failed to delete lead.");
    } finally {
      setDeleteLeadId(null);
      setIsDeleteModalOpen(false);
    }
  };



  const exportCsv = (onlySelected = false) => {
    const exportLeads = onlySelected ? leads.filter(lead => selected.includes(lead._id)) : leads;
    if (exportLeads.length === 0) return;

    const headers = ["Name", "Email", "IQ Score", "Intent", "Status", "Source", "Date Added"];
    const rows = exportLeads.map(lead => [
      `"${lead.name || ""}"`,
      `"${lead.email || ""}"`,
      lead.iq_score,
      `"${lead.intent || ""}"`,
      `"${lead.status || ""}"`,
      `"${lead.source || ""}"`,
      lead.date_added ? new Date(lead.date_added).toLocaleDateString() : "N/A"
    ]);

    const csv = headers.join(",") + "\n" + rows.map(row => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = onlySelected ? "selected-deleted-leads.csv" : "all-deleted-leads.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };



  const handleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((selectedId) => selectedId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selected.length === leads.length) {
      setSelected([]);
    } else {
      setSelected(leads.map((lead) => lead.deletedLeadId));
    }
  };




  const totalPages = Math.max(1, Math.ceil((Number.isFinite(total) ? total : 0) / pageSize));

  return (
    <div className="ml-64 p-8 min-h-screen bg-[var(--body-background)] text-text">
      <Sidebar />
      <DashboardHeader title="Recycle Bin - Deleted Leads" showButton="false" />

      <section className="rounded-xl overflow-hidden mb-8" style={{ color: "var(--table-text)", border: "1px solid var(--table-border)" }}>
        {loading ? (
          <div className="rounded-xl shadow-soft p-8 text-center" style={{ background: "var(--table-bg)", color: "var(--table-secondary-text)" }}>
            Loading...
          </div>
        ) : leads.length === 0 ? (
          <EmptyFilter />
        ) : (
          <>
            <table className="min-w-full divide-y rounded-xl" style={{ background: "var(--table-bg)", color: "var(--table-text)" }}>
              <thead style={{ background: "var(--table-header-bg)" }}>
                <tr>
                  <th className="px-4 py-4 text-left text-xs font-semibold" style={{ color: "var(--table-secondary-text)" }}>
                    <input type="checkbox" checked={selected.length === leads.length} onChange={handleSelectAll} />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold" style={{ color: "var(--table-secondary-text)" }}>Name & Email</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold" style={{ color: "var(--table-secondary-text)" }}>IQ Score</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold" style={{ color: "var(--table-secondary-text)" }}>Intent</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold" style={{ color: "var(--table-secondary-text)" }}>Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold" style={{ color: "var(--table-secondary-text)" }}>Date Added</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold" style={{ color: "var(--table-secondary-text)" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead._id} className="transition group" style={{ borderBottom: "1px solid var(--table-border)" }}
                    onMouseOver={e => (e.currentTarget.style.background = "var(--table-row-hover)")}
                    onMouseOut={e => (e.currentTarget.style.background = "var(--table-bg)")}>
                    <td className="px-4 py-5 align-middle">
                      <input
                        type="checkbox"
                        checked={selected.includes(lead.deletedLeadId)}
                        onChange={() => handleSelect(lead.deletedLeadId)}
                      />

                    </td>
                    <td className="px-6 py-5 align-middle">
                      <div>
                        <span className="cursor-pointer font-semibold text-base">
                          {lead.name}
                        </span>
                        <div
                          className="text-sm"
                          style={{ color: "var(--table-secondary-text)" }}
                        >
                          {lead.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 align-middle">
                      <span
                        style={{
                          background:
                            lead.iq_score >= 7
                              ? "var(--table-success)"
                              : lead.iq_score >= 5
                                ? "var(--table-warning)"
                                : "var(--table-danger)",
                          color: "#fff",
                          padding: "0.25rem 0.75rem",
                          borderRadius: "9999px",
                          fontWeight: 600,
                          fontSize: "0.75rem",
                          display: "inline-block",
                        }}
                      >
                        {lead.iq_score}
                      </span>
                      {(lead.iq_score < 6 || lead.iq_score > 9) && (
                        <FontAwesomeIcon
                          icon={faFlag}
                          className="ml-2"
                          style={{ color: "var(--table-warning)" }}
                        />
                      )}
                    </td>
                    <td className="px-6 py-5 align-middle">
                      <span
                        style={{
                          background:
                            lead.intent === "High"
                              ? "rgba(16,185,129,0.1)"
                              : lead.intent === "Medium"
                                ? "rgba(245,158,11,0.1)"
                                : "rgba(107,114,128,0.1)",
                          color:
                            lead.intent === "High"
                              ? "var(--table-success)"
                              : lead.intent === "Medium"
                                ? "var(--table-warning)"
                                : "var(--table-secondary-text)",
                          padding: "0.25rem 0.75rem",
                          borderRadius: "9999px",
                          fontWeight: 500,
                          fontSize: "0.75rem",
                          display: "inline-block",
                        }}
                      >
                        {lead.intent}
                      </span>
                    </td>
                    <td className="px-6 py-5 align-middle">
                      <span
                        style={{
                          background:
                            lead.status === "Hot"
                              ? "rgba(239,68,68,0.1)"
                              : lead.status === "Warm"
                                ? "rgba(245,158,11,0.1)"
                                : "rgba(59,130,246,0.1)",
                          color:
                            lead.status === "Hot"
                              ? "var(--table-danger)"
                              : lead.status === "Warm"
                                ? "var(--table-warning)"
                                : "var(--table-info)",
                          padding: "0.25rem 0.75rem",
                          borderRadius: "9999px",
                          fontWeight: 500,
                          fontSize: "0.75rem",
                          display: "inline-block",
                        }}
                      >
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 align-middle">
                      <span className="flex items-center space-x-2 text-xs font-medium">
                        {lead.source === "LinkedIn" && (
                          <i className="fa-brands fa-linkedin" style={{ color: "#2563eb" }}></i>
                        )}
                        {lead.source === "Google" && (
                          <i className="fa-brands fa-google" style={{ color: "#2563eb" }}></i>
                        )}
                        {lead.source === "Meta" && (
                          <i className="fa-brands fa-facebook" style={{ color: "#2563eb" }}></i>
                        )}
                        {lead.source === "Reddit" && (
                          <i className="fa-brands fa-reddit" style={{ color: "#f59e42" }}></i>
                        )}
                        <span>{lead.source}</span>
                      </span>
                    </td>
                    <td className="px-6 py-5 align-middle">
                      <span className="text-sm">
                        {lead.date_added
                          ? new Date(lead.date_added).toLocaleDateString()
                          : ""}
                      </span>
                    </td>

                    <td className="px-6 py-5 align-middle text-center space-x-2">
                      <button
                        className="inline-flex cursor-pointer items-center justify-center"
                        style={{
                          color: "var(--table-secondary-text)",
                          background: "transparent",
                          borderRadius: "9999px",
                          padding: "0.5rem",
                        }}
                        title="Archive"
                        onClick={() => {
                          setDeleteLeadId(lead.deletedLeadId);
                          setIsDeleteModalOpen(true);
                        }}

                      >
                        <FontAwesomeIcon icon={faArchive} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Footer Actions */}
            <div className="mt-8 rounded-xl p-5 mb-6 flex items-center justify-between" style={{ background: "var(--table-bg)" }}>
              <div className="text-sm font-medium" style={{ color: "var(--table-text)" }}>
                {selected.length} selected
              </div>
              <div className="flex items-center space-x-3">
                <button className="border rounded-lg px-4 py-2 text-sm flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ color: "var(--table-secondary-text)", borderColor: "var(--table-border)", background: "var(--table-bg)" }}
                  onClick={() => exportCsv(true)} disabled={selected.length === 0}>
                  <FontAwesomeIcon icon={faDownload} className="mr-2" /> Export Selected
                </button>
                <button className="border rounded-lg px-4 py-2 text-sm flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ color: "var(--table-secondary-text)", borderColor: "var(--table-border)", background: "var(--table-bg)" }}
                  onClick={() => {
                    setConfirmActionType('restore');
                    setIsConfirmModalOpen(true);
                  }}
                  disabled={selected.length === 0}
                >
                  <FontAwesomeIcon icon={faArchive} className="mr-2" /> Restore Selected
                </button>
                <button className="border rounded-lg px-4 py-2 text-sm flex items-center"
                  style={{ color: "var(--table-secondary-text)", borderColor: "var(--table-border)", background: "var(--table-bg)" }}
                  onClick={() => exportCsv(false)} disabled={leads.length === 0}>
                  <FontAwesomeIcon icon={faDownload} className="mr-2" /> Export CSV
                </button>
              </div>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-4" style={{ background: "var(--table-bg)", borderTop: "1px solid var(--table-border)" }}>
              <div className="text-sm" style={{ color: "var(--table-secondary-text)" }}>
                Showing {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, total)} of {total} leads
              </div>
              <div className="flex space-x-2">
                <button className="w-9 h-9 rounded flex items-center justify-center"
                  style={{ border: "1px solid var(--table-border)", color: "var(--table-secondary-text)", background: "var(--table-bg)" }}
                  onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                  <FontAwesomeIcon icon={faChevronLeft} />
                </button>
                {[...Array(totalPages)].map((_, idx) => (
                  <button key={idx} className="w-9 h-9 rounded flex items-center justify-center"
                    style={{
                      border: "1px solid var(--table-border)",
                      color: page === idx + 1 ? "#fff" : "var(--table-secondary-text)",
                      background: page === idx + 1 ? "var(--table-primary)" : "var(--table-bg)"
                    }}
                    onClick={() => setPage(idx + 1)}>
                    {idx + 1}
                  </button>
                ))}
                <button className="w-9 h-9 rounded flex items-center justify-center"
                  style={{ border: "1px solid var(--table-border)", color: "var(--table-secondary-text)", background: "var(--table-bg)" }}
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                  <FontAwesomeIcon icon={faChevronRight} />
                </button>
              </div>
            </div>
          </>
        )}
      </section>
      <Popup open={isConfirmModalOpen} onClose={() => setIsConfirmModalOpen(false)}>
        <ArchivedNotifiy
          onAction={handleConfirmedAction}
          onclose={() => setIsConfirmModalOpen(false)}
          description={`Are you sure you want to ${confirmActionType} ${selected.length} selected lead(s)?`}
          heading={confirmActionType === 'restore' ? "Restore Lead(s)?" : "Archive Lead(s)?"}
          subDescription={confirmActionType === 'restore'
            ? "They will be moved back to the active lead vault."
            : "You can still access them from archived records."
          }
          primaryButtonText={confirmActionType === 'restore' ? "Restore Lead(s)" : "Archive Lead(s)"}
        />
      </Popup>

      <Popup open={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
        <ArchivedNotifiy
          onAction={handlePermanentDelete}
          onclose={() => setIsDeleteModalOpen(false)}
          description="Are you sure you want to permanently delete this lead? This action cannot be undone."
          heading="Permanently Delete Lead?"
          subDescription="This will remove the lead from both active and deleted records."
          primaryButtonText="Delete Permanently"
        />
      </Popup>


    </div>
  );
}

export default withAuthorization(DeletedLeadsPage, 'delete_leads');
