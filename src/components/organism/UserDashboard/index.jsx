import React, { useEffect, useState } from 'react';
import DashboardHeader from '../DashboardHeader';
import Cards from './cards';
import LeadQuality from './LeadQuality';
import RecentLeads from './RecentLeads';
import LeadPerformance from './LeadPerformance';
import WeeklySummary from './WeeklySummary';
import HelpPanel from './HelpPanel';
import ExportPanel from './ExportPanel';
import { updateUserSettings, getLastExportDate } from '@/utils/userApi';
import { getLeadStats, getMeLeads, getQualifiedLeads } from '@/utils/leadApi'; // Assuming you have these
import { toast } from 'react-toastify';

export default function UserDashboard() {
  const [leadStats, setLeadStats] = useState({ totalLeads: 0, qualifiedLeads: 0 });
  const [lastExport, setLastExport] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allLeadsRes = await getMeLeads();
        console.log('ai h na', allLeadsRes)
        const allLeads = allLeadsRes.leads || [];

        const totalLeads = allLeads.length;
        const qualifiedLeads = allLeads.filter(lead => lead.status === 'qualified').length;

        setLeadStats({ totalLeads, qualifiedLeads });

        const lastExportRaw = await getLastExportDate();
        if (lastExportRaw) {
          const date = new Date(lastExportRaw);
          setLastExport(date.toLocaleDateString() + ' ' + date.toLocaleTimeString());
        }
      } catch (err) {
        console.warn('Failed to fetch data');
      }
    };

    fetchData();
  }, []);


  const exportToCsv = (filename, rows) => {
    if (!rows || rows.length === 0) return;

    const header = Object.keys(rows[0]).join(',');
    const csv = rows.map(row => Object.values(row).join(','));
    const csvContent = [header, ...csv].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportAllLeads = async () => {
    try {
      const data = await getMeLeads();
      exportToCsv('all-leads.csv', data.leads);
    } catch (err) {
      console.error('Export failed:', err);
    }
  };


  const handleExportQualifiedLeads = async () => {
    try {
      const data = await getQualifiedLeads();
      exportToCsv('qualified-leads.csv', data.leads);
    } catch (err) {
      console.error('Export failed:', err);
    }
  };


  return (
    <div className="ml-64 p-8 min-h-screen transition-colors bg-[var(--body-background)] text-text">
      <DashboardHeader title="Dashboard View" btnText="New Upload" onButtonClick={() => { }} />
      <Cards />
      <div className="grid grid-cols-3 gap-6 mb-6">
        <LeadQuality />
        <RecentLeads />
      </div>
      <div className="grid grid-cols-3 gap-6 mb-6">
        <WeeklySummary />
        <LeadPerformance />
      </div>
      <div className="grid grid-cols-3 gap-6 mb-6">
        <ExportPanel
          lastExport={lastExport}
          leadStats={leadStats}
          onToggleSchedule={async (enabled) => {
            try {
              await updateUserSettings({ weekly_report_toggle: enabled });
              toast.success('done')
            } catch (err) {
              console.error('Failed to update report toggle');
              toast.error('error aya')
            }
          }}
          onExportAllLeads={handleExportAllLeads}
          onExportQualifiedLeads={handleExportQualifiedLeads}
        />
      </div>
      <HelpPanel />
    </div>
  );
}
