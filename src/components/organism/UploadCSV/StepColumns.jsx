import React, { useEffect } from "react";

export default function StepColumns({
  columns = [],
  selectedColumns,
  setSelectedColumns,
  useCustomParams,
  setUseCustomParams,
  onPrev,
  onNext,
  processing // 🔹 Add processing prop
}) {
  useEffect(() => {
    if (!selectedColumns || selectedColumns.length === 0) {
      setSelectedColumns(columns);
    }
  }, [columns, selectedColumns, setSelectedColumns]);

  const toggleColumn = (col) => {
    setSelectedColumns((prev) =>
      prev.includes(col) ? prev.filter((c) => c !== col) : [...prev, col]
    );
  };

  const handleToggleChange = () => {
    setUseCustomParams(!useCustomParams);
  };

  const handleContinue = () => {
    if (!processing) onNext();
  };

  return (
    <div className="bg-background text-text p-6 rounded-xl shadow-soft">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <i className="fa-solid fa-table text-primary" />
        Select CSV Columns
      </h2>

      <div className="flex items-center justify-between mb-6">
        <label className="text-sm font-medium text-gray-700">
          Use custom qualification parameters?
        </label>
        <input
          type="checkbox"
          className="w-5 h-5"
          checked={useCustomParams}
          onChange={handleToggleChange}
        />
      </div>

      <p className="text-sm text-secondary mb-6">
        By default, all columns are selected for processing. You can uncheck any columns you want to exclude.
      </p>

      <div className="grid grid-cols-2 gap-3 mb-8">
        {columns.map((col, idx) => (
          <label key={idx} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedColumns.includes(col)}
              onChange={() => toggleColumn(col)}
              className="accent-primary"
            />
            <span>{col}</span>
          </label>
        ))}
      </div>

      <div className="w-full flex justify-between mt-8">
        <button
          className="cursor-pointer rounded-lg px-6 py-3 font-semibold bg-gray-100 text-secondary hover:bg-gray-200 transition"
          onClick={onPrev}
        >
          Back
        </button>

        <button
          className="cursor-pointer rounded-lg px-6 py-3 font-semibold text-white bg-primary hover:bg-primary/90 transition disabled:opacity-50"
          onClick={handleContinue}
          disabled={processing}
        >
          {processing
            ? "Processing..."
            : useCustomParams
            ? "Next: Set Parameters →"
            : "Process List"}
        </button>
      </div>
    </div>
  );
}
