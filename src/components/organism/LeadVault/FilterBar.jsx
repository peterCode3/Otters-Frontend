import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGrip,
  faList,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";

export default function FilterBar({
  filters = [],
  values = {},
  onChange = () => {},
  className = "",
  buttons = [
    // {
    //   icon: faGrip,
    //   label: "",
    //   onClick: () => {},
    //   active: false,
    //   className: "text-gray-500",
    // },
    // {
    //   icon: faList,
    //   label: "",
    //   onClick: () => {},
    //   active: true,
    //   className: "bg-primary text-white",
    // },
    // {
    //   icon: faDownload,
    //   label: "Export CSV",
    //   onClick: () => {},
    //   className: "text-gray-500 border border-gray-200 rounded-lg px-3 py-2 text-sm flex items-center ml-2",
    // },
  ],
}) {
  return (
    <div
      className={`flex flex-wrap items-center ${className}`}
    >
      {filters.map((filter) => (
        <div className="flex flex-col" key={filter.name}>
          <label className="text-xs font-medium text-secondary mb-1">
            {filter.label}
          </label>
          <select
            className="border border-gray-200 rounded-lg py-1.5 px-4 text-sm focus:ring-primary focus:outline-none bg-background"
            value={values[filter.name] || ""}
            onChange={(e) => onChange(filter.name, e.target.value)}
          >
            {filter.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      ))}
      {buttons && (
        <div className="flex items-center ml-auto border border-gray-200 rounded-lg overflow-hidden">
        {buttons.map((btn, idx) => (
          <button
            key={btn.label || idx}
            className={`cursor-pointer px-3 py-2 text-sm flex items-center transition-colors
              ${btn.active ? "bg-[var(--color-primary)] text-white" : ""}
              ${btn.className || ""}
            `}
            onClick={btn.onClick}
            type="button"
          >
            <FontAwesomeIcon icon={btn.icon} className={btn.label ? "mr-2" : ""} />
            {btn.label}
          </button>
        ))}
        
      </div>
      )}
    </div>
  );
}