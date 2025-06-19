import React, { useEffect, useState } from 'react';
import DashboardHeader from '../DashboardHeader';
import DashboardKpis from './DashboardKpis';
import ClientManagement from './ClientManagement';
import UnqualifiedLeadsCard from './UnqualifiedLeadsCard';
import LeadQualityTrendsCard from './LeadQualityTrendsCard';
import ManualReviewQueue from './ManualReviewQueue';
import EmptyClientsState from './EmptyClientsState';
import { fetchLeadQualityTrends } from '@/utils/leadApi';
import {fetchClients} from '@/utils/clientApi';
import LoadingDashboard from './LoadingDashboard';


export default function Dashboard() {
  const [chartData, setChartData] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const reasons = [
    { label: "Budget too low", percent: 42, colorVar: "--unqualified-primary" },
    { label: "Wrong region", percent: 28, colorVar: "--unqualified-blue" },
    { label: "Vague intent", percent: 30, colorVar: "--unqualified-purple" },
  ];

  useEffect(() => {
    setLoading(true)
    fetchLeadQualityTrends().then(setChartData);
    fetchClients().then((data) => {
      if (data.length === 0) {
        setClients([]);
      } else {
        setClients(data);
      }
    });
    setTimeout(function(){
      setLoading(false)
    }, 3000)
  }, []);

  
  if (loading) {
    return <LoadingDashboard/>
  }else if (clients.length === 0) {
    return (
      <div className="ml-64 p-8 min-h-screen transition-colors bg-[var(--body-background)] text-text">
        <DashboardHeader title='Dashboard View' btnText='New Upload'/>
        <EmptyClientsState />
      </div>
    );
  }


  return (
    <div className="ml-64 p-8 min-h-screen transition-colors bg-[var(--body-background)] text-text">
      {/* Header */}
      <DashboardHeader title='Dashboard View' btnText='New Upload'/>
      <DashboardKpis />
      <div className='grid grid-cols-3 gap-6'>
        <ClientManagement />
        <UnqualifiedLeadsCard total={384} reasons={reasons} />
        <LeadQualityTrendsCard
          chartData={chartData}
          targetScore={7.0}
          showAnomaly={true}
        />
        <ManualReviewQueue />
      </div>
    </div>
  );
}
