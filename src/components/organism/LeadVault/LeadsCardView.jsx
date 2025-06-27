import LeadCard from "./LeadCard";

export default function LeadsCardView({ leads, onView, onComment, onDelete }) {
  if (!leads || leads.length === 0) {
    return (
      <div className="text-center py-6 text-[var(--table-secondary-text)]">
        No leads found.
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
      {leads.map((lead) => (
        <LeadCard
          key={lead._id}
          lead={lead}
          onView={() => onView(lead._id)}
          onComment={() => onComment(lead._id)}
          onDelete={() => onDelete(lead._id)}
        />
      ))}
    </div>
  );
}
