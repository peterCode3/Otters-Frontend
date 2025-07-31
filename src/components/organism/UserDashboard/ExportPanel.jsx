'use client';

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { downloadWeeklySummary } from '@/utils/donwload';
import {
  faFileCsv,
  faFilePdf,
  faDownload,
} from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';

const ExportPanel = ({
  lastExport = '3 days ago',
  leadStats = { totalLeads: 0, qualifiedLeads: 0 },
  weeklyReportEnabled = true,
  onToggleSchedule = () => {},
  onExportAllLeads = () => {},
  onExportQualifiedLeads = () => {},
}) => {
  const [isScheduled, setIsScheduled] = useState(weeklyReportEnabled);

  const handleToggle = () => {
    const next = !isScheduled;
    setIsScheduled(next);
    onToggleSchedule(next);
  };

  const handleDownloadWeeklySummary = async () => {
  try {
    await downloadWeeklySummary();
  } catch (err) {
    toast.error('Failed to download summary.');
  }
};

  return (
    <div
      id="export-panel"
      className="rounded-xl p-6 shadow-soft"
      style={{ background: 'var(--color-white)' }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-bold text-lg" style={{ color: 'var(--color-text)' }}>
          Export Reports
        </h2>
        <div className="text-xs" style={{ color: 'var(--color-secondary)' }}>
          Last export: {lastExport}
        </div>
      </div>

      <div className="space-y-4">
        {/* All Leads */}
        <button
          onClick={onExportAllLeads}
          className="cursor-pointer w-full border rounded-lg py-3 px-4 flex items-center justify-between hover:bg-gray-50"
          style={{ backgroundColor: 'var(--color-white)', borderColor: 'var(--client-card-border)' }}
        >
          <div className="flex items-center">
            <FontAwesomeIcon icon={faFileCsv} className="text-xl mr-3" style={{ color: 'var(--color-primary)' }} />
            <div className="text-left">
              <span className="block font-medium" style={{ color: 'var(--color-text)' }}>Export All Leads</span>
              <span className="text-xs" style={{ color: 'var(--color-secondary)' }}>{leadStats.totalLeads} leads total</span>
            </div>
          </div>
          <FontAwesomeIcon icon={faDownload} style={{ color: 'var(--color-secondary)' }} />
        </button>

        {/* Qualified Leads */}
        <button
          onClick={onExportQualifiedLeads}
          className="cursor-pointer w-full border rounded-lg py-3 px-4 flex items-center justify-between hover:bg-gray-50"
          style={{ backgroundColor: 'var(--color-white)', borderColor: 'var(--client-card-border)' }}
        >
          <div className="flex items-center">
            <FontAwesomeIcon icon={faFileCsv} className="text-xl mr-3" style={{ color: 'var(--color-success)' }} />
            <div className="text-left">
              <span className="block font-medium" style={{ color: 'var(--color-text)' }}>Export Qualified Leads</span>
              <span className="text-xs" style={{ color: 'var(--color-secondary)' }}>{leadStats.qualifiedLeads} qualified leads</span>
            </div>
          </div>
          <FontAwesomeIcon icon={faDownload} style={{ color: 'var(--color-secondary)' }} />
        </button>

        {/* Weekly Summary */}
        <button className="cursor-pointer w-full border rounded-lg py-3 px-4 flex items-center justify-between hover:bg-gray-50"
          style={{ backgroundColor: 'var(--color-white)', borderColor: 'var(--client-card-border)' }}
          onClick={handleDownloadWeeklySummary}
        >
          <div className="flex items-center">
            <FontAwesomeIcon icon={faFilePdf} className="text-xl mr-3" style={{ color: 'var(--color-danger)' }} />
            <div className="text-left">
              <span className="block font-medium" style={{ color: 'var(--color-text)' }}>Download Weekly Summary</span>
              <span className="text-xs" style={{ color: 'var(--color-secondary)' }}>PDF report with insights</span>
            </div>
          </div>
          <FontAwesomeIcon icon={faDownload} style={{ color: 'var(--color-secondary)' }} />
        </button>
      </div>

      {/* Schedule Report */}
      <div className="mt-6">
        <h3 className="text-sm font-medium mb-3" style={{ color: 'var(--color-secondary)' }}>
          Schedule Reports
        </h3>
        <div className="flex items-center justify-between text-sm" style={{ color: 'var(--color-text)' }}>
          <span>Weekly email report</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={isScheduled}
              onChange={handleToggle}
            />
            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[var(--color-primary)]"></div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default ExportPanel;
