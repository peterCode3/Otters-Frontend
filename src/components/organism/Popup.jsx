import React from "react";

export default function Popup({ open, onClose, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 items-center justify-center" style={{ backgroundColor: 'var(--popup-bg)', overflowX: "scroll" }}>
      <div className="dark:bg-gray-800 rounded-lg shadow-lg p-6 min-w-[320px] relative">
        <button
          className="absolute top-2 right-2 text-white cursor-pointer text-5xl closed hover:text-primary"
          onClick={onClose}
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}