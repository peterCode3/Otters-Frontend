import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faComment, faArchive, faFlag } from "@fortawesome/free-solid-svg-icons";

export default function LeadCard({ lead, onView, onComment, onDelete }) {

  return (
    <div className="bg-[var(--card-bg)] text-[var(--card-title)] rounded-xl shadow-soft p-5 border border-[var(--client-card-border)] flex flex-col justify-between">
      <div className="mb-0">
        <div className="flex justify-between items-start mb-2">
          <div onClick={onView} className="cursor-pointer">
            <h3 className="font-semibold text-lg">{lead.name}</h3>
            <p className="text-sm text-[var(--color-secondary)]">{lead.email}</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="bg-[var(--card-icon-bg)] text-[var(--color-success)] text-xs px-2 py-1 rounded-full font-medium">
              {lead.iq_score}
            </span>
            {(lead.iq_score < 6 || lead.iq_score > 9) && (
              <FontAwesomeIcon icon={faFlag} className="text-[var(--color-warning)]" />
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 text-xs mb-3">
          <span className='px-2 py-1 rounded-full' style={{
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
          <span className="px-2 py-1 rounded-full"
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
          <span className="px-2 py-1 rounded-full flex items-center space-x-2 text-xs font-medium">
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
        </div>
        <div className="text-sm mb-2 text-secondary">
          <p>{lead.summary}</p>
        </div>
        <div className="flex border-t border-gray-100">
          <div className="flex-1 py-2 px-3 text-xs text-center border-r border-gray-100">
            <div className="text-secondary">Source</div>
            <div className="font-medium flex items-center justify-center mt-1">
              {lead.source}
            </div>
          </div>
          <div className="flex-1 py-2 px-3 text-xs text-center border-r border-gray-100">
            <div className="text-secondary">Client</div>
            <div className="font-medium mt-1">{lead.client_id.username}</div>
          </div>
          <div className="flex-1 py-2 px-3 text-xs text-center">
            <div className="text-secondary">Added</div>
            <div className="font-medium mt-1">{lead.date_added ? new Date(lead.date_added).toLocaleDateString() : "N/A"}</div>
          </div>
        </div>

      </div>

      <div className="flex border-t border-[var(--client-card-border)] pt-3 mt-auto text-sm text-center">
        <button
          onClick={onView}
          className="flex-1 text-[var(--color-primary)] py-2 cursor-pointer"
        >
          <FontAwesomeIcon icon={faEye} className="mr-1" /> View
        </button>
        <button
          onClick={onComment}
          className="flex-1 text-[var(--color-secondary)] py-2 border-l border-[var(--client-card-border)] cursor-pointer"
        >
          <FontAwesomeIcon icon={faComment} className="mr-1" /> Comment
        </button>
        <button
          onClick={onDelete}
          className="flex-1 text-[var(--color-secondary)] py-2 border-l border-[var(--client-card-border)] cursor-pointer"
        >
          <FontAwesomeIcon icon={faArchive} className="mr-1" /> Delete
        </button>
      </div>

    </div>
  );
}
