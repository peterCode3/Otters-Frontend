// components/ApplyTagsModal.jsx
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTags, faXmark, faTag } from "@fortawesome/free-solid-svg-icons";

const savedTags = [
  "Follow-up",
  "Spam Concern",
  "VIP Prospect",
  "Needs Demo",
  "Do Not Contact"
];

export default function ApplyTagsModal({ open, onClose, onApply, leadCount }) {
  const [selectedTags, setSelectedTags] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    if (!open) {
      setSelectedTags([]);
      setInput("");
    }
  }, [open]);

  const addTag = (tag) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
      setInput("");
    }
  };

  const removeTag = (tag) => {
    setSelectedTags(selectedTags.filter(t => t !== tag));
  };

  const handleApply = () => {
    if (selectedTags.length > 0) {
      onApply(selectedTags);
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div className="h-full inset-0 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 min-w-[400px]">
        <div className="mb-6 flex items-center">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary bg-opacity-10 text-primary mr-4"
            style={{background: 'var(--bg-light-primary)', color: 'var(--color-text)'}}
          >
            <FontAwesomeIcon icon={faTags} />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-1">Apply Tags</h2>
            <span className="text-secondary text-sm">Apply to {leadCount} leads</span>
          </div>
        </div>

        <label className="block font-medium text-text text-base mb-2">Tags</label>
        <div className="flex flex-wrap gap-2 items-center px-3 py-2 bg-gray-50 rounded-xl border border-gray-200 min-h-[48px]">
          {selectedTags.map(tag => (
            <span key={tag} className="inline-flex items-center px-3 py-1 rounded-full bg-primary bg-opacity-10 text-primary text-sm font-medium">
              <FontAwesomeIcon icon={faTag} className="mr-1 text-xs" />
              {tag}
              <button className="ml-2" onClick={() => removeTag(tag)}>
                <FontAwesomeIcon icon={faXmark} className="hover:text-danger text-xs" />
              </button>
            </span>
          ))}
          <input
            className="flex-1 border-0 bg-transparent focus:ring-0 focus:outline-none py-2 text-base text-text"
            placeholder="Add tag and press Enter…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && input.trim()) {
                addTag(input.trim());
                e.preventDefault();
              }
            }}
          />
        </div>

        <div className="mt-2 flex flex-wrap gap-2">
          {savedTags
            .filter(tag => tag.toLowerCase().includes(input.toLowerCase()) && !selectedTags.includes(tag))
            .map(tag => (
              <button
                key={tag}
                className="cursor-pointer px-3 py-1 bg-primary bg-opacity-10 text-primary rounded-full text-sm font-medium hover:bg-primary hover:text-white transition"
                style={{background: 'var(--bg-light-primary)', color: 'var(--color-text)'}}
                onClick={() => addTag(tag)}
              >
                {tag}
              </button>
            ))}
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button onClick={onClose} className="cursor-pointer px-5 py-2 rounded-lg border border-gray-200 text-text font-medium bg-white hover:bg-gray-50">
            Cancel
          </button>
          <button onClick={handleApply} className="cursor-pointer px-5 py-2 rounded-lg bg-primary text-white font-semibold hover:bg-[#0090b6]" style={{background: 'var(--color-primary)'}}>
            Apply Tags
          </button>
        </div>
      </div>
    </div>
  );
}
