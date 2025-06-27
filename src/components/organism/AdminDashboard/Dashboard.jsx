import React, { useEffect, useState } from 'react';
import DashboardHeader from '../DashboardHeader';
import DashboardKpis from './DashboardKpis';
import ClientManagement from './ClientManagement';
import UnqualifiedLeadsCard from './UnqualifiedLeadsCard';
import LeadQualityTrendsCard from './LeadQualityTrendsCard';
import ManualReviewQueue from './ManualReviewQueue';
import EmptyClientsState from './EmptyClientsState';
import { fetchClients } from '@/utils/clientApi';
import LoadingDashboard from './LoadingDashboard';
import Popup from '../Popup';
import { getAllUsers } from '@/utils/userApi';
import CsvWizard from '../UploadCSV/CsvWizard';
import { fetchUnqualifiedLeadsSummary } from '@/utils/leadApi';

export default function Dashboard({ clientId = 'all' }) {
  const [chartData, setChartData] = useState([]);
  const [clients, setClients] = useState([]);
  const [user, setUser] = useState([]);
  const [summary, setSummary] = useState({ total: 0, reasons: [] });

  const [loading, setLoading] = useState(false);
  const [openCsv, setOpenCsv] = useState(false);

  useEffect(() => {
    setLoading(true)
    getAllUsers().then(users => {
      setUser(users);
    });
    fetchClients().then((data) => {
      if (data.length === 0) {
        setClients([]);
      } else {
        setClients(data);
      }
    });
    fetchUnqualifiedLeadsSummary(clientId).then(setSummary);

    setTimeout(function () {
      setLoading(false)
    }, 3000)
  }, [clientId]);


  if (loading) {
    return <LoadingDashboard />
  } else if (clients.length === 0) {
    return (
      <div className="ml-64 p-8 min-h-screen transition-colors bg-[var(--body-background)] text-text">
        <DashboardHeader title='Dashboard View' btnText='New Upload' onButtonClick={() => setOpenCsv(true)} />
        <EmptyClientsState />
        <Popup open={openCsv} onClose={() => setOpenCsv(false)}>
          <CsvWizard />
        </Popup>
      </div>
    );
  }


  return (
    <div className="ml-64 p-8 min-h-screen transition-colors bg-[var(--body-background)] text-text">
      {/* Header */}
      <DashboardHeader title='Dashboard View' btnText='New Upload' onButtonClick={() => setOpenCsv(true)} />
      <DashboardKpis />
      <div className='grid grid-cols-3 gap-6'>
        <ClientManagement />
        <UnqualifiedLeadsCard
          total={summary.total}
          reasons={summary.reasons}
        />        
        <LeadQualityTrendsCard
          targetScore={7.0}
          showAnomaly={true}
          clients={user}
        />
        <ManualReviewQueue />
      </div>
      <Popup open={openCsv} onClose={() => setOpenCsv(false)}>
        <CsvWizard />
      </Popup>
    </div>
  );
}
