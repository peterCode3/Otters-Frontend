import React, { useState } from 'react';
import Sidebar from '@/src/components/organism/Sidebar';
import Dashboard from '@/src/components/organism/Dashboard';
import '@/app/globals.css'; // Ensure global styles are imported
const DashboardPage = () => {
    const [darkMode, setDarkMode] = useState(false);

    return (
        <div>
            <Sidebar darkMode={darkMode} />
            <Dashboard darkMode={darkMode} />
            
            <button
                className="fixed bottom-4 right-4 bg-primary text-white px-4 py-2 rounded-lg shadow"
                onClick={() => setDarkMode(dm => !dm)}
            >
                Toggle {darkMode ? 'Light' : 'Dark'} Mode
            </button>
        </div>
    );
};

export default DashboardPage;