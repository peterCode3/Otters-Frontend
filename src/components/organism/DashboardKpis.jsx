import React, { useEffect, useState } from 'react';
import { faUsers, faCheckCircle, faBrain, faChartLine, faArrowUp } from '@fortawesome/free-solid-svg-icons';
import Card from './AdminDashboard/Card';
import { fetchLeads } from '@/utils/leadApi';

const DashboardKpis = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeads().then(data => {
      setLeads(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div>Loading...</div>;

  // Calculations
  const totalLeads = leads.length;
  const qualifiedLeads = leads.filter(l => l.status === 'qualified').length;
  const avgIqScore = leads.length
    ? (leads.reduce((sum, l) => sum + (l.iq_score || 0), 0) / leads.length).toFixed(1)
    : 0;
  const conversionRate = totalLeads ? ((qualifiedLeads / totalLeads) * 100).toFixed(1) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <Card
        icon={faUsers}
        title="Total Leads"
        value={totalLeads}
        trendIcon={faArrowUp}
        trend="12%"
        trendClass="text-success"
        progress={totalLeads ? 100 : 0}
      />
      <Card
        icon={faCheckCircle}
        title="Qualified Leads"
        value={qualifiedLeads}
        trendIcon={faArrowUp}
        trend="8%"
        trendClass="text-success"
        progress={totalLeads ? (qualifiedLeads / totalLeads) * 100 : 0}
      />
      <Card
        icon={faBrain}
        title="Avg IQ Score"
        value={avgIqScore}
        trendIcon={faArrowUp}
        trend="0.2"
        trendClass="text-success"
        progress={avgIqScore * 10}
      />
      <Card
        icon={faChartLine}
        title="Conversion Rate"
        value={`${conversionRate}%`}
        trendIcon={faArrowUp}
        trend="3.2%"
        trendClass="text-success"
        progress={conversionRate}
      />
    </div>
  );
};

export default DashboardKpis;