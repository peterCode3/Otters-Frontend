import React, { useEffect, useState } from 'react';
import { faUsers, faCheckCircle, faArrowDown, faBrain, faChartLine, faArrowUp } from '@fortawesome/free-solid-svg-icons';
import Card from './Card';
import { fetchLeads } from '@/utils/leadApi';
import { fetchLeadsTrend } from '@/utils/leadApi';
const DashboardKpis = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trendStats, setTrendStats] = useState(null);

  useEffect(() => {
    fetchLeads().then(data => {
      setLeads(data);
      setLoading(false);
    });
    fetchLeadsTrend().then(data => {
      setTrendStats(data);
    }).catch(err => {
      console.error("Error fetching client stats:", err);
    });
  }, []);



  if (loading || !trendStats) return <div>Loading...</div>;

  // Calculations
  const totalLeads = leads.length;
  const qualifiedLeads = leads.filter(l => l.status === 'qualified').length;
  const avgIqScore = leads.length
    ? (leads.reduce((sum, l) => sum + (l.iq_score || 0), 0) / leads.length).toFixed(1)
    : 0;
  const conversionRate = totalLeads ? ((qualifiedLeads / totalLeads) * 100).toFixed(1) : 0;


  // Use trendStats from API
  const leadsTrend = trendStats.leadsThisWeek;
  const qualifiedLeadsTrend = trendStats.qualifiedLeadsThisWeek; // You can calculate % if you want
  const avgScoreTrend = trendStats.avgScoreThisWeek;


  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <Card
        icon={faUsers}
        title="Total Leads"
        value={totalLeads}
        trendIcon={leadsTrend > 0 ? faArrowUp : faArrowDown}
        trend={`${leadsTrend > 0 ? '+' : ''}${leadsTrend}%`}
        trendClass={leadsTrend > 0 ? "text-green-600" : leadsTrend < 0 ? "text-red-600" : "text-gray-600"}
        progress={totalLeads ? 100 : 0}
      />
      <Card
        icon={faCheckCircle}
        title="Qualified Leads"
        value={qualifiedLeads}
        trendIcon={qualifiedLeadsTrend > 0 ? faArrowUp : faArrowDown}
        trend={`${qualifiedLeadsTrend > 0 ? '+' : ''}${qualifiedLeadsTrend}%`}
        trendClass={qualifiedLeadsTrend > 0 ? "text-green-600" : qualifiedLeadsTrend < 0 ? "text-red-600" : "text-gray-600"}
        progress={totalLeads ? (qualifiedLeads / totalLeads) * 100 : 0}
      />
      <Card
        icon={faBrain}
        title="Avg IQ Score"
        value={avgIqScore}
        trendIcon={avgScoreTrend > 0 ? faArrowUp : faArrowDown}
        trend={`${avgScoreTrend > 0 ? '+' : ''}${avgScoreTrend}%`}
        trendClass={avgScoreTrend > 0 ? "text-green-600" : avgScoreTrend < 0 ? "text-red-600" : "text-gray-600"}
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