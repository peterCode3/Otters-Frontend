import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";

Chart.register(ArcElement, Tooltip, Legend);

// Helper to get CSS variable value
function getCssVarValue(varName) {
  if (typeof window === "undefined") return "#000";
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim() || "#000";
}

export default function UnqualifiedLeadsCard({ total, reasons }) {
  // Resolve color variables to real colors
  const chartColors = reasons.map(r => getCssVarValue(r.colorVar));

  // Resolve colors upfront for both chart and legend
  const reasonsWithColors = reasons.map((r) => ({
    ...r,
    resolvedColor: getCssVarValue(r.colorVar),
  }));

  const data = {
    labels: reasonsWithColors.map(r => r.label),
    datasets: [
      {
        data: reasonsWithColors.map(r => r.percent),
        backgroundColor: reasonsWithColors.map(r => r.resolvedColor),
        borderWidth: 0,
      },
    ],
  };

  
  const options = {
    cutout: "70%",
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
  };

  return (
    <div
      className="rounded-xl p-6 shadow-soft"
      style={{ background: "var(--unqualified-bg)" }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-bold text-lg" style={{ color: "var(--unqualified-title)" }}>
          Unqualified Leads
        </h2>
        <div className="text-xs" style={{ color: "var(--unqualified-secondary)" }}>
          {total} leads
        </div>
      </div>
      <div className="h-60 flex items-center justify-center mb-4" style={{ width: 341, height: 240 }}>
        <Doughnut data={data} options={options} />
      </div>
      <div className="mt-4">
        {reasons.map((reason) => (
          <div className="flex items-center justify-between mb-2" key={reason.label}>
            <div className="flex items-center">
              <div
                className="w-3 h-3 rounded-full mr-2"
                style={{ background: `var(${reason.colorVar})` }}
              ></div>
              <span className="text-sm" style={{ color: 'var(--color-black)' }}>{reason.label}</span>
            </div>
            <span className="font-medium" style={{ color: 'var(--color-black)' }}>{reason.percent}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}