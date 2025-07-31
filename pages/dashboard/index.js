import React, { useState } from 'react';
import Sidebar from '@/src/components/organism/Sidebar';
import Dashboard from '@/src/components/organism/AdminDashboard/Dashboard';
import CsvWizard from '@/src/components/organism/UploadCSV/CsvWizard';
import withAuthorization from '@/utils/withAuthorization'

const DashboardPage = () => {

    return (
        <div>
            {/* <CsvWizard/> */}
            <Sidebar />
            <Dashboard/>
        </div>
    );
};

export default withAuthorization(DashboardPage, 'admin_dashboard');