import { useEffect, useState } from "react";
import {
  fetchLeadByMeId,
  archiveLead,
  addLeadComment,
  fetchArchiveLeadByMeId,
  updateLeadById,
} from "@/utils/leadApi";
import { deleteArchivedLead } from "@/utils/archiveleadApi";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faBuilding,
  faEnvelope,
  faBrain,
  faLink,
  faCalendar,
  faRobot,
  faBoxArchive,
  faCommentDots,
  faCircleCheck,
  faPen,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
import Popup from "../../Popup";
import ArchivedNotifiy from "../ArchivedNotifiy";

export default function LeadDetailsModal({ leadId, open, onClose }) {
  const [lead, setLead] = useState(null);
  const [client, setClient] = useState(null);
  const [notes, setNotes] = useState("");
  const [cmopen, setcmOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [isArchived, setIsArchived] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editableLead, setEditableLead] = useState(null);

  useEffect(() => {
    if (!leadId || !open) return;
    setLoading(true);

    
    fetchLeadByMeId(leadId)
      .then((data) => {
        setLead(data);
        setClient(data.client_id);
        setIsArchived(false);
        setEditableLead({ ...data });
        console.log('ue h lead data ')
      })
      .catch(async (err) => {
        if (err?.response?.status === 404) {
          try {
            const archivedData = await fetchArchiveLeadByMeId(leadId);
            setLead(archivedData);
            setClient(archivedData.client_id);
            setIsArchived(true);
            setEditableLead({ ...archivedData });
        console.log('and ue h archive lead data ')

          } catch (archiveErr) {
            console.error("Archived fetch error:", archiveErr);
          }
        } else {
          console.error("Lead fetch error:", err);
        }
      })
      .finally(() => setLoading(false));
  }, [leadId, open]);


  console.log(isArchived)

  const handleInputChange = (field, value) => {
    setEditableLead((prev) => ({ ...prev, [field]: value }));
  };

  const handleMatchToggle = (key) => {
    setEditableLead((prev) => ({
      ...prev,
      gpt_json: {
        ...prev.gpt_json,
        matches: {
          ...prev.gpt_json?.matches,
          [key]: !prev.gpt_json?.matches?.[key],
        },
      },
    }));
  };

  const handleArchive = async () => {
    if (!lead) return;
    try {
      if (isArchived) {
        await deleteArchivedLead(lead._id);
        setIsArchived(false);
        toast.success("Lead restored.");
      } else {
        await archiveLead(lead._id);
        setIsArchived(true);
        toast.success("Lead archived.");
      }
      setcmOpen(false);
    } catch (error) {
      toast.error(`Failed to ${isArchived ? "restore" : "archive"} lead.`);
      console.error(error);
    }
  };

  const handleComment = async () => {
    if (!notes.trim()) return;
    try {
      await addLeadComment({
        lead_id: lead._id,
        comment_type: "reviewer",
        leads_comment: notes,
      });
      setNotes("");
      toast.success("Comment added!");
    } catch {
      toast.error("Failed to add comment.");
    }
  };

  const handleSave = async () => {
    try {
      await updateLeadById(lead._id, editableLead);
      toast.success("Lead updated!");
      setLead({ ...editableLead });
      setIsEditing(false);
    } catch (err) {
      toast.error("Failed to update lead.");
      console.error(err);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[black]/30">
      <div className="w-full max-w-2xl bg-white dark:bg-[var(--background)] rounded-2xl shadow-soft px-8 py-7 flex flex-col gap-7 relative">
        <button
          className="cursor-pointer absolute top-4 right-4 text-secondary hover:text-danger text-3xl transition rounded-full p-2"
          onClick={onClose}
        >
          &times;
        </button>

        {loading || !editableLead ? (
          <div className="p-10 text-center">Loading...</div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              {client?.logo ? (
                <img
                  src={client.logo}
                  alt={client.company || client.username || "Client"}
                  className="w-12 h-12 rounded-full object-cover border-2 border-primary"
                />
              ) : (
                <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center text-primary text-2xl font-semibold">
                  <FontAwesomeIcon icon={faUser} />
                </div>
              )}
              <div className="w-full">
                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <input
                      className="text-xl font-bold text-text w-full border px-2 py-1 rounded"
                      value={editableLead.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                    />
                  ) : (
                    <h2 className="text-xl font-bold text-text">{lead.name}</h2>
                  )}
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                    {client.industry_tag || "Client"}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-secondary">
                    <FontAwesomeIcon icon={faBuilding} className="text-xs" />
                    {client?.company || client?.username || "N/A"}
                  </span>
                  <span className="flex items-center gap-1 text-xs">
                    <FontAwesomeIcon icon={faEnvelope} className="text-secondary" />
                    {isEditing ? (
                      <input
                        className="border rounded px-1 py-0.5 text-xs"
                        value={editableLead.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                      />
                    ) : (
                      <span>{lead.email}</span>
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Meta Info */}
            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-secondary">IQ Score</span>
                  {isEditing ? (
                    <input
                      type="number"
                      className="text-sm px-2 py-1 rounded border w-20"
                      value={editableLead.iq_score}
                      onChange={(e) => handleInputChange("iq_score", e.target.value)}
                    />
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-success/10 text-success border border-success/60">
                      <FontAwesomeIcon icon={faBrain} className="mr-1" /> {lead.iq_score}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-semibold text-sm text-secondary">Source</span>
                  <span className="inline-flex items-center px-2 py-1 rounded bg-background text-xs text-secondary font-medium">
                    <FontAwesomeIcon icon={faLink} className="mr-1" /> {lead.source}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-secondary">Date Added</span>
                  <span className="inline-flex items-center px-2 py-1 rounded bg-background text-xs text-secondary font-medium">
                    <FontAwesomeIcon icon={faCalendar} className="mr-1" /> {lead.date_added?.slice(0, 10)}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-semibold text-sm text-secondary">Status</span>
                  {isEditing ? (
                    <input
                      className="border rounded px-2 py-1 text-xs"
                      value={editableLead.status}
                      onChange={(e) => handleInputChange("status", e.target.value)}
                    />
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded bg-background text-xs text-secondary font-medium">
                      <FontAwesomeIcon icon={faLink} className="mr-1" /> {lead.status}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* GPT Summary */}
            <div className="rounded-xl bg-background px-6 py-5 shadow-soft flex flex-col gap-3">
              <div className="flex items-center gap-2 mb-1">
                <FontAwesomeIcon icon={faRobot} className="text-primary" />
                <span className="text-base font-bold text-text">GPT Score Explanation</span>
              </div>
              <div className="text-sm text-secondary leading-relaxed mb-2">
                {isEditing ? (
                  <textarea
                    className="w-full border rounded px-2 py-1"
                    value={editableLead.summary}
                    rows={3}
                    onChange={(e) => handleInputChange("summary", e.target.value)}
                  />
                ) : (
                  lead.summary || "No summary available."
                )}
              </div>

              {/* Match Criteria */}
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(editableLead.gpt_json?.matches || {}).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-2">
                    <button
                      disabled={!isEditing}
                      onClick={() => handleMatchToggle(key)}
                      className={`w-7 h-7 flex items-center justify-center rounded-full text-lg border ${
                        value
                          ? 'bg-[var(--success-bg)] text-[var(--success)] border-[var(--success-border)]'
                          : 'bg-[var(--danger-bg)] text-[var(--danger)] border-[var(--danger-border)]'
                      }`}
                    >
                      <FontAwesomeIcon icon={faCircleCheck} />
                    </button>
                    <span className="text-sm font-medium text-text capitalize">{key.replace(/_/g, ' ')}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ml-auto ${
                        value
                          ? 'bg-[var(--success-bg)] text-[var(--success)]'
                          : 'bg-[var(--danger-bg)] text-[var(--danger)]'
                      }`}
                    >
                      {value ? 'Match' : 'Not Match'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="flex flex-col gap-2">
              <label htmlFor="reviewer-notes" className="text-sm font-semibold text-text">Reviewer Notes</label>
              <textarea
                id="reviewer-notes"
                rows={3}
                placeholder="Add comments or recommendations..."
                className="rounded-lg border border-gray-200 bg-background px-4 py-2 text-base focus:ring-primary focus:outline-none text-text placeholder-secondary resize-none"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 mt-4">
              <button
                className="cursor-pointer rounded-lg px-6 py-2 font-semibold text-secondary bg-gray-100 hover:bg-gray-200"
                onClick={() => setcmOpen(true)}
              >
                <FontAwesomeIcon icon={faBoxArchive} className="mr-2" />
                {isArchived ? "Restore" : "Archive"}
              </button>

              <button
                className="cursor-pointer rounded-lg px-6 py-2 font-semibold text-primary bg-primary/10 hover:bg-primary/20"
                onClick={handleComment}
              >
                <FontAwesomeIcon icon={faCommentDots} className="mr-2" />
                Comment
              </button>

              {isEditing ? (
                <button
                  className="cursor-pointer rounded-lg px-6 py-2 font-semibold text-green-600 bg-green-100 hover:bg-green-200"
                  onClick={handleSave}
                >
                  <FontAwesomeIcon icon={faSave} className="mr-2" />
                  Save
                </button>
              ) : (
                <button
                  className="cursor-pointer rounded-lg px-6 py-2 font-semibold text-blue-600 bg-blue-100 hover:bg-blue-200"
                  onClick={() => setIsEditing(true)}
                >
                  <FontAwesomeIcon icon={faPen} className="mr-2" />
                  Edit
                </button>
              )}
            </div>
          </>
        )}
      </div>

      <Popup onClose={() => setcmOpen(false)} open={cmopen}>
        <ArchivedNotifiy
          onAction={handleArchive}
          onclose={() => setcmOpen(false)}
          open={cmopen}
          description={
            isArchived
              ? "Do you want to restore this lead from the archive?"
              : "Are you sure you want to archive this lead?"
          }
        />
      </Popup>
    </div>
  );
}
