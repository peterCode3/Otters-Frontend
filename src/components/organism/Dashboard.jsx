import React from 'react';
import Heading from '../atoms/Heading/Heading';
import DashboardHeader from './DashboardHeader';
import DashboardKpis from './DashboardKpis';
import ClientManagement from './ClientManagement';

const Dashboard = () => (
  <div className="ml-64 p-8 min-h-screen transition-colors bg-[var(--body-background)] text-text">
    {/* Header */}
    <DashboardHeader />
    <DashboardKpis />
    <ClientManagement/>
  </div>
);

export default Dashboard;