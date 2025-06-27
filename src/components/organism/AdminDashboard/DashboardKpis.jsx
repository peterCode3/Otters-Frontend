import React, { useEffect, useState } from 'react';
import {
  faUsers,
  faCheckCircle,
  faArrowDown,
  faArrowUp,
  faBrain,
  faChartLine,
} from '@fortawesome/free-solid-svg-icons';
import Card from './Card';
import { fetchLeads, fetchLeadsTrend } from '@/utils/leadApi';
import FilterBar from '../LeadVault/FilterBar';

const DashboardKpis = () => {
  const [leads, setLeads] = useState([]);
  const [trendStats, setTrendStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ range: '7d' });

  const rangeOptions = [
    { label: 'Last 7 Days', value: '7d' },
    { label: 'Last 30 Days', value: '30d' },
    { label: 'Last 90 Days', value: '90d' },
    { label: 'This Year', value: '365d' },
  ];

  const loadData = async (range = '7d') => {
    setLoading(true);
    try {
      const [leadsData, trendData] = await Promise.all([
        fetchLeads(),
        fetchLeadsTrend(range),
      ]);
      setLeads(leadsData);
      setTrendStats(trendData);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData(filters.range);
  }, [filters.range]);

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  if (loading || !trendStats) return <div>Loading...</div>;

  // 🔢 Safe Calculations
  const totalLeads = leads.length;
  const qualifiedLeads = leads.filter((l) => l.status === 'qualified').length;

  const avgIqScore = leads.length
    ? (
        leads.reduce((sum, l) => sum + (l.iq_score || 0), 0) / leads.length
      ).toFixed(1)
    : '0.0';

  const conversionRate = totalLeads
    ? ((qualifiedLeads / totalLeads) * 100).toFixed(1)
    : '0.0';

  // 🧠 Safe trend values
  const leadsTrend = Number(trendStats.totalLeadsTrend || 0);
  const qualifiedLeadsTrend = Number(trendStats.qualifiedLeadsTrend || 0);
  const avgScoreTrend = Number(trendStats.avgIqScoreTrend || 0);

  const getTrendDisplay = (trend) =>
    isFinite(trend) ? `${trend > 0 ? '+' : ''}${trend.toFixed(1)}%` : '0%';

  const getTrendClass = (trend) =>
    trend > 0
      ? 'text-green-600'
      : trend < 0
      ? 'text-red-600'
      : 'text-gray-600';

  return (
    <>
      <FilterBar
        filters={[
          {
            name: 'range',
            label: 'Date Range',
            options: rangeOptions,
          },
        ]}
        values={filters}
        onChange={handleFilterChange}
        className="mb-4"
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card
          icon={faUsers}
          title="Total Leads"
          value={totalLeads}
          trendIcon={leadsTrend >= 0 ? faArrowUp : faArrowDown}
          trend={getTrendDisplay(leadsTrend)}
          trendClass={getTrendClass(leadsTrend)}
          progress={totalLeads ? 100 : 0}
        />

        <Card
          icon={faCheckCircle}
          title="Qualified Leads"
          value={qualifiedLeads}
          trendIcon={qualifiedLeadsTrend >= 0 ? faArrowUp : faArrowDown}
          trend={getTrendDisplay(qualifiedLeadsTrend)}
          trendClass={getTrendClass(qualifiedLeadsTrend)}
          progress={totalLeads ? (qualifiedLeads / totalLeads) * 100 : 0}
        />

        <Card
          icon={faBrain}
          title="Avg IQ Score"
          value={avgIqScore}
          trendIcon={avgScoreTrend >= 0 ? faArrowUp : faArrowDown}
          trend={getTrendDisplay(avgScoreTrend)}
          trendClass={getTrendClass(avgScoreTrend)}
          progress={Math.min(avgIqScore * 10, 100)}
        />

        <Card
          icon={faChartLine}
          title="Conversion Rate"
          value={`${conversionRate}%`}
          trendIcon={faArrowUp}
          trend="3.2%" // Optionally replace with dynamic if available
          trendClass="text-green-600"
          progress={parseFloat(conversionRate)}
        />
      </div>
    </>
  );
};

export default DashboardKpis;
