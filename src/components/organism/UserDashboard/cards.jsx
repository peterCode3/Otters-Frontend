import React, { useEffect, useState } from 'react';
import {
  faUsers,
  faCheckCircle,
  faArrowDown,
  faArrowUp,
  faBrain,
  faChartLine,
} from '@fortawesome/free-solid-svg-icons';
import FilterBar from '../LeadVault/FilterBar';

import Card from '../AdminDashboard/Card';
import { fetchUserLeadsTrend } from '@/utils/leadApi'; // ✅ Your API call utility

const Cards = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  // const [range, setRange] = useState('7d');
  const [filters, setFilters] = useState({ range: '7d' });


  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };


  const rangeOptions = [
    { label: 'Last 7 Days', value: '7d' },
    { label: 'Last 30 Days', value: '30d' },
    { label: 'Last 90 Days', value: '90d' },
    { label: 'This Year', value: '365d' },
  ];

  const getStats = async (range) => {
    setLoading(true);
    try {
      const res = await fetchUserLeadsTrend(range);
      setStats(res);
    } catch (err) {
      console.error('Failed to fetch trend stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {

    getStats(filters.range);

  }, [filters.range]);

  const getTrendDisplay = (trend) =>
    isFinite(trend) ? `${trend > 0 ? '+' : ''}${trend.toFixed(1)}%` : '0%';

  const getTrendClass = (trend) =>
    trend > 0
      ? 'text-green-600'
      : trend < 0
        ? 'text-red-600'
        : 'text-gray-600';


  if (loading || !stats) return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card/>
          <Card/>
          <Card/>
          <Card/>
        </div>
    );
  

  const {
    totalLeads,
    qualifiedLeads,
    avgIqScore,
    conversionRate,
    totalLeadsTrend,
    qualifiedLeadsTrend,
    avgIqScoreTrend,
    conversionRateTrend,
  } = stats;




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
  className="mb-4 gap-x-6 gap-y-4 bg-white shadow-soft rounded-xl px-6 py-4"
/>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card
          icon={faUsers}
          title="Total Leads"
          value={totalLeads}
          trendIcon={totalLeadsTrend >= 0 ? faArrowUp : faArrowDown}
          trend={getTrendDisplay(totalLeadsTrend)}
          trendClass={getTrendClass(totalLeadsTrend)}
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
          trendIcon={avgIqScoreTrend >= 0 ? faArrowUp : faArrowDown}
          trend={getTrendDisplay(avgIqScoreTrend)}
          trendClass={getTrendClass(avgIqScoreTrend)}
          progress={Math.min(avgIqScore * 10, 100)}
        />

        <Card
          icon={faChartLine}
          title="Conversion Rate"
          value={`${conversionRate}%`}
          trendIcon={conversionRateTrend >= 0 ? faArrowUp : faArrowDown}
          trend={getTrendDisplay(conversionRateTrend)}
          trendClass={getTrendClass(conversionRateTrend)}
          progress={parseFloat(conversionRate)}
        />
      </div>
    </>
  );
};

export default Cards;
