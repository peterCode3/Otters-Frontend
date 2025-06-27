import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";

export default function DynamicTable({
  columns,
  rows,
  pageSize = 10,
  selectable = false,
  rowActions = [],
  bulkActions = [],
  title = "Data Table",
  extraButtons,
  extrabuttonOnClcik,
  extrabuttonicon
}) {
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState([]);

  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const paginatedRows = rows.slice((page - 1) * pageSize, page * pageSize);

  const handleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    const ids = paginatedRows.map((row) => row.id || row._id);
    setSelected((prev) =>
      prev.length === ids.length ? [] : [...new Set([...prev, ...ids])]
    );
  };

  return (
    <section
      className="rounded-xl overflow-hidden mb-8"
      style={{
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
              {selectable && (
                <th className="px-4 py-4">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={
                      selected.length > 0 &&
                      paginatedRows.every((row) =>
                        selected.includes(row.id || row._id)
                      )
                    }
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-6 py-4 text-left text-xs font-semibold"
                  style={{ color: "var(--table-secondary-text)" }}
                >
                  {col.label}
                </th>
              ))}
              {rowActions.length > 0 && (
                <th className="px-6 py-4 text-center text-xs font-semibold">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {paginatedRows.map((row) => (
              <tr
                key={row.id || row._id}
                className="transition group"
                style={{
                  background: "var(--table-bg)",
                  borderBottom: "1px solid var(--table-border)",
                }}
              >
                {selectable && (
                  <td className="px-4 py-5 align-middle">
                    <input
                    className="cursor-pointer"
                      type="checkbox"
                      checked={selected.includes(row.id || row._id)}
                      onChange={() => handleSelect(row.id || row._id)}
                    />
                  </td>
                )}
                {columns.map((col) => (
                  <td key={col.key} className="px-6 py-5 align-middle">
                    {col.render
                      ? col.render(row[col.key], row)
                      : row[col.key]}
                  </td>
                ))}
                {rowActions.length > 0 && (
                  <td className="cursor-pointer  px-6 py-5 align-middle text-center space-x-2">
                    {rowActions.map((action, index) => (
                      <button
                        key={index}
                        title={action.title}
                        onClick={() => action.onClick(row)}
                        className="text-sm"
                        style={{
                          color: action.color || "var(--table-primary)",
                          background: "transparent",
                          borderRadius: "9999px",
                          padding: "0.5rem",
                        }}
                      >
                      {action.icon && <FontAwesomeIcon icon={action.icon} className="mr-2" />}
                      </button>
                    ))}
                  </td>
                )}
              </tr>
            ))}
            {paginatedRows.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0) + (rowActions.length > 0 ? 1 : 0)}
                  className="text-center py-6 text-sm"
                  style={{ color: "var(--table-secondary-text)" }}
                >
                  No data found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Bulk Actions */}
      
      {selectable && selected.length > 0 ? (
        <div className=" px-6 py-4 flex items-center justify-between">
          <div className="text-sm text-text font-medium">
            {selected.length} selected
          </div>
          <div className="flex gap-2">
            {bulkActions.map((action, index) => (
              <button
                key={index}
                className="cursor-pointer  border rounded-lg px-3 py-2 text-sm"
                style={{
                  color: "var(--table-secondary-text)",
                  borderColor: "var(--table-border)",
                  background: "var(--table-bg)",
                }}
                onClick={() => action.onClick(selected)}
              >
                <FontAwesomeIcon icon={action.icon} className="mr-2" />
                {action.label}
              </button>
            ))}
          </div>
        </div>
      ) : ( 
        extraButtons  &&  (
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="text-sm text-text font-medium">
          </div>
          <div className="flex gap-2">
              <button
                className="cursor-pointer border rounded-lg px-3 py-2 text-sm"
                style={{
                  color: "var(--table-secondary-text)",
                  borderColor: "var(--table-border)",
                  background: "var(--table-bg)",
                }}
                onClick={extrabuttonOnClcik}
              >
                <FontAwesomeIcon icon={extrabuttonicon} className="mr-2" />
                {extraButtons}
              </button>
          </div>
          </div>
          )
      )} 

      {/* Pagination */}
      <div
        className="flex items-center justify-between px-6 py-4"
        style={{
          background: "var(--table-bg)",
          borderTop: "1px solid var(--table-border)",
        }}
      >
        <div className="text-sm" style={{ color: "var(--table-secondary-text)" }}>
          Showing {(page - 1) * pageSize + 1}–
          {Math.min(page * pageSize, rows.length)} of {rows.length}
        </div>
        <div className="flex space-x-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="cursor-pointer w-9 h-9 border rounded flex items-center justify-center"
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx}
              onClick={() => setPage(idx + 1)}
              className="cursor-pointer w-9 h-9 border rounded flex items-center justify-center"
              style={{
                background: page === idx + 1 ? "var(--table-primary)" : "var(--table-bg)",
                color: page === idx + 1 ? "#fff" : "var(--table-secondary-text)",
              }}
            >
              {idx + 1}
            </button>
          ))}
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="cursor-pointer w-9 h-9 border rounded flex items-center justify-center"
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
      </div>
    </section>
  );
}
