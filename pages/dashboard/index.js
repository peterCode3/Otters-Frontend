import React, { useState } from 'react';
import Sidebar from '@/src/components/organism/Sidebar';
import Dashboard from '@/src/components/organism/Dashboard';

const DashboardPage = () => {
    const [darkMode, setDarkMode] = useState(false);

    return (
        <div>
            <Sidebar darkMode={darkMode} />
            <Dashboard darkMode={darkMode} />
        </div>
    );
};

export default DashboardPage;