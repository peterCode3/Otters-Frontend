'use client';

import { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import { fetchUserLeadsTrend } from '@/utils/leadApi';

export default function LeadPerformance() {
  const chartRef = useRef();
  const chartInstanceRef = useRef(null);
  const [range, setRange] = useState('7d');
  const [loading, setLoading] = useState(false);
  const [leads, setLeads] = useState({});

  const getCSS = (name) =>
    getComputedStyle(document.documentElement).getPropertyValue(name)?.trim();

  useEffect(() => {
    let animationFrameId;

    const loadChart = async () => {
      try {
        setLoading(true);
        const data = await fetchUserLeadsTrend(range);
const { avgIqScore, totalLeads, qualifiedLeads } = data;
const labels = data.labels || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const totalLeadsArray = [Number(data.totalLeads || 0)];
const qualifiedLeadsArray = [Number(data.qualifiedLeads || 0)];
const avgIqScoreArray = [Number(data.avgIqScore || 0)];

setLeads(data);

        setLeads(data);

        const primary = getCSS('--color-primary') || '#00A3CF';
        const green = getCSS('--color-success') || '#10B981';
        const blue = getCSS('--unqualified-blue') || '#60A5FA';

        animationFrameId = requestAnimationFrame(() => {
          const canvas = chartRef.current;
          if (!canvas) return;

          const ctx = canvas.getContext('2d');
          if (!ctx) return;

          const existingChart = Chart.getChart(canvas);
          if (existingChart) existingChart.destroy();

          // ✅ Properly assign to chartInstanceRef
          chartInstanceRef.current = new Chart(ctx, {
            type: 'bar',
            data: {
              labels,
              datasets: [
                {
                  type: 'bar',
                  label: 'Leads Received',
                  data: totalLeadsArray,
                  backgroundColor: primary,
                  order: 2,
                },
                {
                  type: 'line',
                  label: 'Avg IQ Score',
                  data: avgIqScoreArray,
                  borderColor: blue,
                  backgroundColor: 'rgba(96, 165, 250, 0.1)',
                  fill: false,
                  tension: 0.4,
                  pointRadius: 4,
                  pointBackgroundColor: '#fff',
                  pointBorderColor: blue,
                  pointBorderWidth: 2,
                  yAxisID: 'y1',
                  order: 0,
                },
                {
                  type: 'line',
                  label: 'Qualified %',
                  data: qualifiedLeadsArray,
                  borderColor: green,
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  fill: false,
                  tension: 0.4,
                  pointRadius: 4,
                  pointBackgroundColor: '#fff',
                  pointBorderColor: green,
                  pointBorderWidth: 2,
                  yAxisID: 'y1',
                  order: 1,
                },
              ],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
                tooltip: { mode: 'index', intersect: false },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  title: { display: true, text: 'Lead Count' },
                  grid: { color: 'rgba(0, 0, 0, 0.05)' },
                },
                y1: {
                  beginAtZero: true,
                  position: 'right',
                  max: 100,
                  title: { display: true, text: 'Score / Percentage' },
                  grid: { display: false },
                },
                x: { grid: { display: false } },
              },
            },
          });

          setLoading(false);
        });
      } catch (error) {
        console.error('Failed to load chart:', error);
        setLoading(false);
      }
    };

    loadChart();

    // ✅ Cleanup
    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [range]);

  return (
    <div className="bg-white rounded-xl p-6 shadow-soft col-span-2">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Lead Performance</h2>
        <div className="flex space-x-2">
          {['7d', '30d', '90d'].map((r) => (
            <button
              key={r}
              className={`px-3 py-1 text-xs rounded-full ${
                range === r ? 'bg-[var(--color-primary)] text-white' : 'text-secondary hover:bg-gray-100'
              }`}
              onClick={() => setRange(r)}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="h-64 relative">
        <canvas ref={chartRef} className="w-full h-full" />
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 z-10 text-sm text-secondary">
            Loading chart...
          </div>
        )}
      </div>

      <div className="flex justify-between mt-4 text-xs text-secondary">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-[var(--color-primary)] mr-2 opacity-70"></div>
          <span>Leads Received {leads.totalLeads}</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-400 mr-2"></div>
          <span>Avg IQ Score {leads.avgIqScore}</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-400 mr-2"></div>
          <span>Qualified % {leads.qualifiedLeads}</span>
        </div>
      </div>
    </div>
  );
}
