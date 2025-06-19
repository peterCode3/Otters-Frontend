import React, { useEffect, useState } from "react";
import { fetchLeadByClientId, deleteLead } from "@/utils/leadApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faArchive,
  faComment,
  faChevronLeft,
  faChevronRight,
  faDownload,
  faTag,
  faFlag,
} from "@fortawesome/free-solid-svg-icons";

export default function LeadsTable({ clientId, filters = {} }) {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 6;
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    setLoading(true);
    fetchLeadByClientId(clientId, page, pageSize, filters).then((data) => {
      setLeads(data.leads || []);
      setTotal(data.total || 0);
      setSelected([]);
      setLoading(false);
    });
  }, [clientId, page, filters]);

  const handleDelete = async (id) => {
    await deleteLead(id);
    setLeads((prev) => prev.filter((lead) => lead._id !== id));
    setSelected((prev) => prev.filter((sid) => sid !== id));
  };

  const handleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selected.length === leads.length) {
      setSelected([]);
    } else {
      setSelected(leads.map((lead) => lead._id));
    }
  };

  const handleClearSelection = () => setSelected([]);

  // CSV Export (simple frontend version)
  const exportCsv = (onlySelected = false) => {
    const exportLeads = onlySelected
      ? leads.filter((lead) => selected.includes(lead._id))
      : leads;
    if (exportLeads.length === 0) return;

    const headers = [
      "Name",
      "Email",
      "IQ Score",
      "Intent",
      "Status",
      "Source",
      "Date Added",
    ];
    const rows = exportLeads.map((lead) => [
      `"${lead.name || ""}"`,
      `"${lead.email || ""}"`,
      lead.iq_score,
      `"${lead.intent || ""}"`,
      `"${lead.status || ""}"`,
      `"${lead.source || ""}"`,
      lead.date_added
        ? `"${new Date(lead.date_added).toLocaleDateString()}"`
        : "",
    ]);
    const csv =
      headers.join(",") +
      "\n" +
      rows.map((row) => row.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = onlySelected ? "selected-leads.csv" : "all-leads.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  if (loading)
    return (
      <div
        className="rounded-xl shadow-soft p-8 text-center"
        style={{
          background: "var(--table-bg)",
          color: "var(--table-secondary-text)",
        }}
      >
        Loading...
      </div>
    );

  return (
    <section
      className="rounded-xl overflow-hidden mb-8"
      style={{
        background: "var(--table-bg)",
        color: "var(--table-text)",
        border: "1px solid var(--table-border)",
      }}
    >
      <div className="overflow-x-auto">
        <table
          className="min-w-full divide-y rounded-xl"
          style={{
            background: "var(--table-bg)",
            color: "var(--table-text)",
          }}
        >
          <thead style={{ background: "var(--table-header-bg)" }}>
            <tr>
              <th
                className="px-4 py-4 text-left text-xs font-semibold tracking-wider"
                style={{
                  color: "var(--table-secondary-text)",
                  background: "var(--table-header-bg)",
                }}
              >
                <input
                  type="checkbox"
                  checked={leads.length > 0 && selected.length === leads.length}
                  onChange={handleSelectAll}
                  aria-label="Select all"
                />
              </th>
              <th
                className="px-6 py-4 text-left text-xs font-semibold tracking-wider"
                style={{
                  color: "var(--table-secondary-text)",
                  background: "var(--table-header-bg)",
                }}
              >
                Name &amp; Email
              </th>
              <th
                className="px-6 py-4 text-left text-xs font-semibold tracking-wider"
                style={{
                  color: "var(--table-secondary-text)",
                  background: "var(--table-header-bg)",
                }}
              >
                IQ Score
              </th>
              <th
                className="px-6 py-4 text-left text-xs font-semibold tracking-wider"
                style={{
                  color: "var(--table-secondary-text)",
                  background: "var(--table-header-bg)",
                }}
              >
                Intent
              </th>
              <th
                className="px-6 py-4 text-left text-xs font-semibold tracking-wider"
                style={{
                  color: "var(--table-secondary-text)",
                  background: "var(--table-header-bg)",
                }}
              >
                Status
              </th>
              <th
                className="px-6 py-4 text-left text-xs font-semibold tracking-wider"
                style={{
                  color: "var(--table-secondary-text)",
                  background: "var(--table-header-bg)",
                }}
              >
                Source
              </th>
              <th
                className="px-6 py-4 text-left text-xs font-semibold tracking-wider"
                style={{
                  color: "var(--table-secondary-text)",
                  background: "var(--table-header-bg)",
                }}
              >
                Date Added
              </th>
              <th
                className="px-6 py-4 text-center text-xs font-semibold tracking-wider"
                style={{
                  color: "var(--table-secondary-text)",
                  background: "var(--table-header-bg)",
                }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr
                key={lead._id}
                className="transition group rounded-lg"
                style={{
                  background: "var(--table-bg)",
                  color: "var(--table-text)",
                  borderBottom: "1px solid var(--table-border)",
                }}
                onMouseOver={e =>
                  (e.currentTarget.style.background = "var(--table-row-hover)")
                }
                onMouseOut={e =>
                  (e.currentTarget.style.background = "var(--table-bg)")
                }
              >
                <td className="px-4 py-5 align-middle">
                  <input
                    type="checkbox"
                    checked={selected.includes(lead._id)}
                    onChange={() => handleSelect(lead._id)}
                    aria-label="Select lead"
                  />
                </td>
                <td className="px-6 py-5 align-middle">
                  <div>
                    <span className="font-semibold text-base">{lead.name}</span>
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
                    className="inline-flex items-center justify-center"
                    style={{
                      color: "var(--table-primary)",
                      background: "transparent",
                      borderRadius: "9999px",
                      padding: "0.5rem",
                    }}
                    title="View"
                  >
                    <FontAwesomeIcon icon={faEye} />
                  </button>
                  <button
                    className="inline-flex items-center justify-center"
                    style={{
                      color: "var(--table-secondary-text)",
                      background: "transparent",
                      borderRadius: "9999px",
                      padding: "0.5rem",
                    }}
                    title="Comment"
                  >
                    <FontAwesomeIcon icon={faComment} />
                  </button>
                  <button
                    className="inline-flex items-center justify-center"
                    style={{
                      color: "var(--table-secondary-text)",
                      background: "transparent",
                      borderRadius: "9999px",
                      padding: "0.5rem",
                    }}
                    title="Archive"
                    onClick={() => handleDelete(lead._id)}
                  >
                    <FontAwesomeIcon icon={faArchive} />
                  </button>
                </td>
              </tr>
            ))}
            {leads.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-6" style={{ color: "var(--table-secondary-text)" }}>
                  No leads found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Bulk Actions */}
      <div
        className="mt-8 rounded-xl p-5 mb-6 flex items-center justify-between"
        style={{
          background: "var(--table-bg)",
          borderTop: "1px solid var(--table-border)",
        }}
      >
        <div className="flex items-center space-x-4">
          <div className="text-sm font-medium" style={{ color: "var(--table-text)" }}>
            {selected.length} lead{selected.length !== 1 ? "s" : ""} selected
          </div>
          <button
            className="text-primary text-sm"
            style={{ color: "var(--table-primary)", background: "transparent" }}
            onClick={handleSelectAll}
            disabled={leads.length === 0}
          >
            Select All
          </button>
          <button
            className="text-secondary text-sm"
            style={{ color: "var(--table-secondary-text)", background: "transparent" }}
            onClick={handleClearSelection}
            disabled={selected.length === 0}
          >
            Clear Selection
          </button>
        </div>
        <div className="flex items-center space-x-3">
          <button
            className="border rounded-lg px-4 py-2 text-sm flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              color: "var(--table-secondary-text)",
              borderColor: "var(--table-border)",
              background: "var(--table-bg)",
            }}
            disabled={selected.length === 0}
            onClick={() => exportCsv(true)}
          >
            <FontAwesomeIcon icon={faDownload} className="mr-2" />
            Export Selected
          </button>
          <button
            className="border rounded-lg px-4 py-2 text-sm flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              color: "var(--table-secondary-text)",
              borderColor: "var(--table-border)",
              background: "var(--table-bg)",
            }}
            disabled={selected.length === 0}
          >
            <FontAwesomeIcon icon={faTag} className="mr-2" />
            Add Tags
          </button>
          <button
            className="border rounded-lg px-4 py-2 text-sm flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              color: "var(--table-secondary-text)",
              borderColor: "var(--table-border)",
              background: "var(--table-bg)",
            }}
            disabled={selected.length === 0}
          >
            <FontAwesomeIcon icon={faArchive} className="mr-2" />
            Archive Selected
          </button>
          <button
            className="border rounded-lg px-3 py-2 text-sm flex items-center"
            style={{
              color: "var(--table-secondary-text)",
              borderColor: "var(--table-border)",
              background: "var(--table-bg)",
            }}
            onClick={() => exportCsv(false)}
            disabled={leads.length === 0}
          >
            <FontAwesomeIcon icon={faDownload} className="mr-2" />
            Export CSV
          </button>
        </div>
      </div>
      {/* Pagination */}
      <div
        className="flex items-center justify-between px-6 py-4"
        style={{
          background: "var(--table-bg)",
          borderTop: "1px solid var(--table-border)",
        }}
      >
        <div className="text-l" style={{ color: "var(--table-secondary-text)" }}>
          Showing {(page - 1) * pageSize + 1}-
          {Math.min(page * pageSize, total)} of {total} leads
        </div>
        <div className="flex space-x-2 items-center">
          <button
            className="w-9 h-9 rounded flex items-center justify-center"
            style={{
              border: "1px solid var(--table-border)",
              color: "var(--table-secondary-text)",
              background: "var(--table-bg)",
            }}
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx}
              className="w-9 h-9 rounded flex items-center justify-center"
              style={{
                border: "1px solid var(--table-border)",
                color: page === idx + 1 ? "#fff" : "var(--table-secondary-text)",
                background: page === idx + 1 ? "var(--table-primary)" : "var(--table-bg)",
              }}
              onClick={() => setPage(idx + 1)}
            >
              {idx + 1}
            </button>
          ))}
          <button
            className="w-9 h-9 rounded flex items-center justify-center"
            style={{
              border: "1px solid var(--table-border)",
              color: "var(--table-secondary-text)",
              background: "var(--table-bg)",
            }}
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
      </div>
    </section>
  );
}