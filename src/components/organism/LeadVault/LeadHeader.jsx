import React from "react";
import Heading from "../../atoms/Heading/Heading";

export default function LeadHeader({
  title = "Dashboard Overview",
  subtitle = "",
  avatarUrl = "",
  tags = [],
  actions = null,
  children,
}) {
  return (
    <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 space-y-4 sm:space-y-0">
      <div className="flex items-center space-x-4">
        {avatarUrl && (
          <div className="w-14 h-14 bg-white rounded-xl shadow-soft flex items-center justify-center">
            <img
              src={avatarUrl}
              alt={title}
              className="w-12 h-12 rounded-lg object-cover"
            />
          </div>
        )}
        <div>
          <Heading className="text-2xl font-bold tracking-tight mb-1 flex items-center" level='4'>
            <span className="text-black">{title}</span>
            {tags.map((tag, idx) => (
              <span
                key={idx}
                className="ml-3 text-xs bg-primary/10 text-primary font-semibold px-2 py-1 rounded-full"
                style={{ background: 'var(--bg-light-primary)' }}
              >
                {tag}
              </span>
            ))}
          </Heading>
          {subtitle && <div className="text-xs text-secondary">{subtitle}</div>}
        </div>
      </div>
      {actions && <div>{actions}</div>}
      {children}
    </header>
  );
}