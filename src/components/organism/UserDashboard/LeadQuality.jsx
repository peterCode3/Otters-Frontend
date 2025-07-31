'use client';

import { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import FilterBar from '../LeadVault/FilterBar';
import { getUserLeadQualityOverview } from '@/utils/leadApi';

export default function LeadQuality() {
  const gaugeRef = useRef(null);
  const intentRef = useRef(null);
  const [filters, setFilters] = useState({ range: '30d' });
  const gaugeChartRef = useRef(null);
  const intentChartRef = useRef(null);
  const [iqScore, setIqScore] = useState(0);
  const [intent, setIntent] = useState([0, 0, 0]);
  const [status, setStatus] = useState({ hot: 0, warm: 0, cold: 0 });

  const rangeOptions = [
    { label: 'Last 7 Days', value: '7d' },
    { label: 'Last 30 Days', value: '30d' },
    { label: 'Last 90 Days', value: '90d' },
    { label: 'This Year', value: '365d' },
  ];

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };


  const getCSSVar = (name) =>
    getComputedStyle(document.documentElement).getPropertyValue(name)?.trim();

  const parseRangeToDays = (rangeStr) => parseInt(rangeStr.replace('d', ''), 10);

  useEffect(() => {
    async function fetchData() {
      try {
        const days = parseRangeToDays(filters.range);
        const data = await getUserLeadQualityOverview(days);

        setIqScore(data.avgIqScore || 0);
        setIntent([
          data.intent.High || 0,
          data.intent.Medium || 0,
          data.intent.Low || 0,
        ]);
        setStatus({
          hot: data.status.hot || 0,
          warm: data.status.warm || 0,
          cold: data.status.cold || 0,
        });
        console.log('Top Lead:', data.leadWithHighestIq);
      } catch (err) {
        console.error('Error fetching overview:', err);
      }
    }

    fetchData();
  }, [filters.range]);


  useEffect(() => {
    const primary = getCSSVar('--color-primary') || '#00A3CF';
    const success = getCSSVar('--color-success') || '#10B981';
    const warning = getCSSVar('--color-warning') || '#F59E0B';
    const danger = getCSSVar('--color-danger') || '#EF4444';

    if (gaugeRef.current) {
      gaugeChartRef.current?.destroy();

      gaugeChartRef.current = new Chart(gaugeRef.current, {
        type: 'doughnut',
        data: {
          datasets: [
            {
              data: [iqScore * 10, 100 - iqScore * 10],
              backgroundColor: [primary, '#EEF2F6'],
              borderWidth: 0,
              cutout: '80%',
            },
          ],
        },
        options: {
          plugins: { legend: { display: false }, tooltip: { enabled: false } },
        },
      });
    }

    if (intentRef.current) {
      intentChartRef.current?.destroy();

      intentChartRef.current = new Chart(intentRef.current, {
        type: 'doughnut',
        data: {
          labels: ['High', 'Medium', 'Low'],
          datasets: [
            {
              data: intent,
              backgroundColor: [success, warning, danger],
              borderWidth: 0,
            },
          ],
        },
        options: {
          plugins: { legend: { display: false } },
          cutout: '70%',
        },
      });
    }
  }, [iqScore, intent]);

  useEffect(() => {
    return () => {
      gaugeChartRef.current?.destroy();
      intentChartRef.current?.destroy();
    };
  }, []);

  const getIqClass = () => {
    if (iqScore >= 7) return { bg: '--client-card-status-healthy-bg', color: '--client-card-status-healthy-text' };
    if (iqScore >= 5) return { bg: '--client-card-status-risk-bg', color: '--client-card-status-risk-text' };
    return { bg: '--client-card-status-poor-bg', color: '--client-card-status-poor-text' };
  };

  const iqClass = getIqClass();

  return (
    <div className="bg-white dark:bg-[var(--card-bg)] rounded-xl p-6 shadow-soft">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="font-bold text-lg" style={{ color: 'var(--card-title)' }}>Lead Quality</h2>
        <span className="text-xs px-2 py-1 rounded-full" style={{
            backgroundColor: 'var(--table-tag-bg)',
            color: 'var(--color-secondary)',
          }}>
            {rangeOptions.find(opt => opt.value === filters.range)?.label}
          </span>
        </div>
        <div className="items-center  gap-2">
          <FilterBar
            filters={[{ name: 'range', label: 'Date Range', options: rangeOptions }]}
            values={filters}
            onChange={handleFilterChange}
            className="mb-0 p-0 gap-[0px !important] py-0 px-0"
        />
          
        </div>
      </div>

      <div className="flex justify-center mb-6">
        <div className="relative w-48 h-48">
          <canvas ref={gaugeRef}></canvas>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold" style={{ color: 'var(--color-primary)' }}>{iqScore}</span>
            <span className="text-sm" style={{ color: 'var(--color-secondary)' }}>IQ Score</span>
            <span className="text-xs mt-1 px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: `var(${iqClass.bg})`,
                color: `var(${iqClass.color})`
              }}>
              {iqScore >= 7 ? 'Strong' : iqScore >= 5 ? 'Moderate' : 'Weak'}
            </span>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-medium mb-3" style={{ color: 'var(--color-secondary)' }}>
          Intent Distribution
        </h3>
        <div className="h-32 flex items-center justify-center">
          <canvas ref={intentRef}></canvas>
        </div>
        <div className="flex justify-between mt-4 text-xs">
          {[
            { label: 'High', color: '--color-success', value: intent[0] },
            { label: 'Medium', color: '--color-warning', value: intent[1] },
            { label: 'Low', color: '--color-danger', value: intent[2] },
          ].map(({ label, color, value }) => (
            <div className="flex items-center" key={label}>
              <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: `var(${color})` }}></div>
              <span>{label} ({value}%)</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-3" style={{ color: 'var(--color-secondary)' }}>
          Status Breakdown
        </h3>
        <div className="space-y-3">
          {[
            { key: 'hot', label: 'Hot Leads', color: '--color-success' },
            { key: 'warm', label: 'Warm Leads', color: '--color-warning' },
            { key: 'cold', label: 'Cold Leads', color: '--color-danger' },
          ].map(({ key, label, color }) => (
            <div key={key}>
              <div className="flex justify-between text-sm mb-1">
                <span>{label}</span>
                <span className="font-medium">{status[key]}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="h-2 rounded-full" style={{
                  width: `${status[key]}%`,
                  backgroundColor: `var(${color})`
                }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
