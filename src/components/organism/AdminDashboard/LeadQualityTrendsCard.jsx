import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Filler,
} from "chart.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";

Chart.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Filler);

export default function LeadQualityTrendsCard({
  chartData = [],
  targetScore = 7.0,
  showAnomaly = true,
  periods = ["Last 30 Days", "Last 7 Days", "Last 90 Days", "This Year"],
  clients = [],
}) {
  // SSR-safe color fallback, update to CSS variable on client
  const [primaryColor, setPrimaryColor] = useState("#00A3CF");
  const [grayColor, setGrayColor] = useState("#D1D5DB");
  const [selectedClient, setSelectedClient] = useState("All Clients");
  const [selectedPeriod, setSelectedPeriod] = useState(periods[0]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const getCssVar = (v, fallback) =>
        getComputedStyle(document.documentElement).getPropertyValue(v).trim() || fallback;
      setPrimaryColor(getCssVar("--leadtrends-primary", "#00A3CF"));
      setGrayColor(getCssVar("--leadtrends-gray", "#D1D5DB"));
    }
  }, []);

  // Prepare chart data
  const labels = chartData.map((d) => d.label);
  const avgIqScores = chartData.map((d) => d.avgIqScore);
  const targetScores = chartData.map(() => targetScore);

  const data = {
    labels,
    datasets: [
      {
        label: "Avg IQ Score",
        data: avgIqScores,
        borderColor: primaryColor,
        backgroundColor: "rgba(0,163,207,0.08)",
        tension: 0.4,
        pointRadius: 5,
        pointBackgroundColor: primaryColor,
        pointBorderColor: "#fff",
        fill: true,
        order: 2,
      },
      {
        label: `Target Score (${targetScore})`,
        data: targetScores,
        borderColor: grayColor,
        backgroundColor: grayColor,
        borderDash: [6, 6],
        pointRadius: 0,
        fill: false,
        order: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
    scales: {
      y: {
        beginAtZero: false,
        min: 5,
        max: 9,
        ticks: { stepSize: 1, color: "#6B7280" },
        grid: { color: "#F3F4F6" },
      },
      x: {
        ticks: { color: "#6B7280" },
        grid: { display: false },
      },
    },
  };

  return (
    <div
      className="bg-white dark:bg-[var(--leadtrends-bg)] rounded-xl p-6 shadow-soft col-span-3"
      style={{
        maxHeight: 480,
        overflowX: "auto",
        borderRadius: "18px",
      }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-bold text-lg" style={{ color: "var(--leadtrends-title)" }}>
          Lead Quality Trends
        </h2>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <select
              className="appearance-none bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg py-1.5 pl-4 pr-8 text-sm focus:outline-none"
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
            >
              <option>All Clients</option>
              {clients.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
              <FontAwesomeIcon icon={faChevronDown} className="text-xs" />
            </div>
          </div>
          <div className="relative">
            <select
              className="appearance-none bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg py-1.5 pl-4 pr-8 text-sm focus:outline-none"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
            >
              {periods.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
              <FontAwesomeIcon icon={faChevronDown} className="text-xs" />
            </div>
          </div>
        </div>
      </div>
      <div className="h-80" style={{ minHeight: 320 }}>
        <Line data={data} options={options} height={320} />
      </div>
      <div className="flex justify-between mt-4 text-xs" style={{ color: "var(--leadtrends-secondary)" }}>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full mr-2" style={{ background: primaryColor }}></div>
          <span>Avg IQ Score</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full mr-2" style={{ background: grayColor }}></div>
          <span>Target Score ({targetScore})</span>
        </div>
        {showAnomaly && (
          <div className="flex items-center">
            <FontAwesomeIcon icon={faTriangleExclamation} className="mr-2" style={{ color: "#F59E0B" }} />
            <span>Score Anomaly</span>
          </div>
        )}
      </div>
    </div>
  );
}