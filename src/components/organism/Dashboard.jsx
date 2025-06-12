import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faPlus, faArrowUp, faArrowDown, 
  faUsers,
  faCheckCircle,
  faBrain,
  faChartLine
} from '@fortawesome/free-solid-svg-icons';
import Heading from '../atoms/Heading/Heading';

import Card from '@/src/components/organism/AdminDashboard/Card';

const DashboardHeader = ({ darkMode }) => (
  <div className={`ml-64 p-8 min-h-screen transition-colors
    ${darkMode ? 'bg-[#0d1a26] text-white' : 'bg-background text-text'}`}>
    {/* Header */}
    <header className="mb-8">
      <div className="flex justify-between items-center">
        <Heading level='4' className="text-2xl font-bold">Dashboard Overview</Heading>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search leads..."
              className={`pl-10 pr-4 py-2 rounded-lg border w-64
                ${darkMode
                  ? 'bg-[#14212e] border-gray-700 text-white placeholder-gray-400'
                  : 'bg-white border-gray-200 text-text placeholder-secondary'
                } focus:outline-none focus:ring-1 focus:ring-primary`}
            />
            <div className="absolute left-3 top-2.5 text-gray-400">
              <FontAwesomeIcon icon={faSearch} />
            </div>
          </div>
          <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium flex items-center">
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            New Upload
          </button>
        </div>
      </div>
    </header>

    <div className='grid grid-cols-4 gap-6 mb-6'>
      <Card
                icon={faUsers}
                title="Total Leads"
                value="1,248"
                trendIcon={faArrowUp}
                trend="12%"
                trendClass="text-success"
                progress={72}
                darkMode={darkMode}
            />
            <Card
                icon={faCheckCircle}
                title="Qualified Leads (IQ ≥ 7)"
                value="864"
                trendIcon={faArrowUp}
                trend="8%"
                trendClass="text-success"
                progress={65}
                darkMode={darkMode}
            />
            <Card
                icon={faBrain}
                title="Avg Otters IQ Score"
                value="7.6"
                trendIcon={faArrowDown}
                trend="0.2"
                trendClass="text-danger"
                progress={76}
                darkMode={darkMode}
            />
            <Card
                icon={faChartLine}
                title="Conversion Rate"
                value="24.8%"
                trendIcon={faArrowUp}
                trend="3.2%"
                trendClass="text-success"
                progress={24.8}
                darkMode={darkMode}
            />
    </div>
  </div>
);

export default DashboardHeader;