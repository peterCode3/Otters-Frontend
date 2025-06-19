import React from "react";

export default function StepColumns({
  columns,
  selectedType,
  setSelectedType,
  selectedColumns,
  setSelectedColumns,
  urlColumn,
  setUrlColumn,
  onPrev,
  onNext
}) {
  const handleColumnToggle = (col) => {
    setSelectedColumns(prev =>
      prev.includes(col) ? prev.filter(c => c !== col) : [...prev, col]
    );
  };

  // Auto-select all columns if "all data ready" is chosen
  React.useEffect(() => {
    if (selectedType === "all") setSelectedColumns(columns);
    else setSelectedColumns([]);
  }, [selectedType, columns, setSelectedColumns]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Select correct columns in CSV</h2>
      <div className="mb-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            checked={selectedType === "urls"}
            onChange={() => setSelectedType("urls")}
          />
          <span>A file with company URLs to be qualified</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer mt-2">
          <input
            type="radio"
            checked={selectedType === "all"}
            onChange={() => setSelectedType("all")}
          />
          <span>
            A file with all data ready for analysis and qualification
            <div className="text-xs text-gray-500">
              Select this if your file already includes all the static data needed for qualification.
            </div>
          </span>
        </label>
      </div>
      {selectedType === "urls" && (
        <div className="mb-8">
          <label className="block mb-2 font-medium">Company URL</label>
          <select
            className="w-full border rounded-lg px-4 py-2"
            value={urlColumn}
            onChange={e => setUrlColumn(e.target.value)}
          >
            <option value="">Select Column</option>
            {columns.map(col => (
              <option key={col} value={col}>{col}</option>
            ))}
          </select>
        </div>
      )}
      {selectedType === "all" && (
        <div className="mb-8">
          <label className="block mb-2 font-medium">Select columns to be processed</label>
          <div className="grid grid-cols-2 gap-2">
            {columns.map(col => (
              <label key={col} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedColumns.includes(col)}
                  onChange={() => handleColumnToggle(col)}
                />
                <span>{col}</span>
              </label>
            ))}
          </div>
        </div>
      )}
      <div className="w-full flex justify-between gap-3 mt-8">
        <button className="rounded-lg px-6 py-3 font-semibold bg-gray-100 text-secondary hover:bg-gray-200 transition" onClick={onPrev}>Back</button>
        <button
          className="rounded-lg px-6 py-3 font-semibold text-white bg-primary hover:bg-primary/90 transition disabled:opacity-50"
          disabled={
            (selectedType === "urls" && !urlColumn) ||
            (selectedType === "all" && selectedColumns.length === 0)
          }
          onClick={onNext}
        >
          Next
        </button>
      </div>
    </div>
  );
}