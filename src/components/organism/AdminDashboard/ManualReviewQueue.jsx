import React, { useEffect, useState } from "react";
import { fetchManualReviewLeads, deleteLead } from "@/utils/leadApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faEye, faPencil, faBoxArchive, faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import LeadDetailsModal from "../LeadVault/leadview/LeadDetailsModal";
import { toast } from "react-toastify";
import Link from "next/link";
export default function ManualReviewQueue() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedLeadId, setSelectedLeadId] = useState(null);

  const handleDelete = async (id) => {
    await deleteLead(id);
    toast.success('Delete Successfully')
    setLeads((prev) => prev.filter((lead) => lead._id !== id));
    setSelected((prev) => prev.filter((sid) => sid !== id));
  };

  useEffect(() => {
    setLoading(true);
    fetchManualReviewLeads(page, pageSize).then(data => {
      // Defensive: check if data and data.leads exist
      if (data && Array.isArray(data.leads)) {
        setLeads(data.leads);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 1);
      } else {
        setLeads([]);
        setTotal(0);
        setTotalPages(1);
      }
      setLoading(false);
    });
  }, [page]);


  return (
    <div
      className="rounded-xl p-6 shadow-soft col-span-3"
      style={{ background: "var(--review-bg)" }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-bold text-lg" style={{ color: "var(--review-title)" }}>
          Manual Review Queue
        </h2>
        <div className="text-sm" style={{ color: "var(--review-secondary)" }}>
          Showing {leads.length} of {total} borderline leads (IQ score 5-6)
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b" style={{ borderColor: "#E5E7EB" }}>
              <th className="text-left py-3 px-4 text-sm font-medium" style={{ color: "var(--review-secondary)" }}>Lead Name</th>
              <th className="text-left py-3 px-4 text-sm font-medium" style={{ color: "var(--review-secondary)" }}>Client</th>
              <th className="text-left py-3 px-4 text-sm font-medium" style={{ color: "var(--review-secondary)" }}>Score</th>
              <th className="text-left py-3 px-4 text-sm font-medium" style={{ color: "var(--review-secondary)" }}>Flag Reason</th>
              <th className="text-left py-3 px-4 text-sm font-medium" style={{ color: "var(--review-secondary)" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="py-6 text-center">Loading...</td></tr>
            ) : leads.length === 0 ? (
              <tr><td colSpan={5} className="py-6 text-center">No leads for review.</td></tr>
            ) : (
              leads.map(lead => (
                <tr key={lead._id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800" style={{ borderColor: "#F3F4F6" }}>
                  <td className="py-3 px-4">
                    <div className="cursor-pointer flex items-center" onClick={() => setSelectedLeadId(lead._id)}>
                      <FontAwesomeIcon icon={faChevronRight} className="text-xs mr-2 text-gray-400" />
                      <span>{lead.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">{lead.client_id?.username || "—"}</td>
                  <td className="py-3 px-4">
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
                  </td>
                  <td className="py-3 px-4">{lead.flag_reason || "—"}</td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button onClick={() => setSelectedLeadId(lead._id)} className="cursor-pointer text-primary hover:text-[var(--review-primary-dark)]">
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                      <button className="text-secondary hover:text-gray-700">
                        <FontAwesomeIcon icon={faPencil} />
                      </button>
                      <button onClick={() => handleDelete(lead._id)} className="cursor-pointer text-secondary hover:text-gray-700">
                        <FontAwesomeIcon icon={faBoxArchive} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center mt-4">
        <button className="text-sm text-primary flex items-center">
          <Link href='leads-voault'>
            <FontAwesomeIcon icon={faEye} className="mr-1" />
            View All Leads
          </Link>
        </button>
        <div className="flex space-x-2">
          <button
            className="text-sm px-3 py-1 border border-gray-200 rounded"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx}
              className={`text-sm px-3 py-1 border border-gray-200 rounded ${page === idx + 1 ? "bg-primary text-white" : ""}`}
              onClick={() => setPage(idx + 1)}
            >
              {idx + 1}
            </button>
          ))}
          <button
            className="text-sm px-3 py-1 border border-gray-200 rounded"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
      </div>

      <LeadDetailsModal
        leadId={selectedLeadId}
        open={!!selectedLeadId}
        onClose={() => setSelectedLeadId(null)}
      />
    </div>
  );
}