import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faOtter,
  faHouse,
  faFolder,
  faGear,
  faMoon
} from '@fortawesome/free-solid-svg-icons';
import Heading from '../atoms/Heading/Heading';
import Paragraph from '../atoms/Paragraph/Paragraph';

const Sidebar = ({ darkMode }) => (
  <div className={`fixed left-0 top-0 h-full w-64 shadow-soft flex flex-col z-10 transition-colors
    ${darkMode ? 'bg-[#0d1a26] text-white' : 'bg-white text-text'}`}>
    {/* Logo and Branding */}
    <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
      <div className="flex items-center space-x-2">
        <div className="text-primary">
          <FontAwesomeIcon icon={faOtter} className="text-2xl" />
        </div>
        <div>
          <Heading className="font-bold text-lg leading-tight" level='4'>OTTERS IQ™</Heading>
          <Paragraph className="text-xs text-secondary">AI-Powered Lead Intelligence</Paragraph>
        </div>
      </div>
    </div>
    {/* Main Navigation */}
    <nav className="flex-1 px-4 py-6">
      <ul className="space-y-1">
        <li>
          <span className={`flex items-center px-4 py-3 rounded-lg cursor-pointer font-medium
            ${darkMode ? 'bg-primary bg-opacity-20 text-primary' : 'bg-primary bg-opacity-10 text-primary'}`}>
            <FontAwesomeIcon icon={faHouse} className="w-5 h-5 mr-3" />
            Dashboard
          </span>
        </li>
        <li>
          <span className="flex items-center px-4 py-3 rounded-lg hover:bg-gray-100 cursor-pointer">
            <FontAwesomeIcon icon={faFolder} className="w-5 h-5 mr-3" />
            Lead Vault
          </span>
        </li>
        <li>
          <span className="flex items-center px-4 py-3 rounded-lg hover:bg-gray-100 cursor-pointer">
            <FontAwesomeIcon icon={faGear} className="w-5 h-5 mr-3" />
            Settings
          </span>
        </li>
      </ul>
    </nav>
    {/* Bottom Navigation */}
    <div className={`p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
      <div className="flex items-center justify-between mb-4">
        <button className="flex items-center text-secondary">
          <FontAwesomeIcon icon={faMoon} className="mr-2" />
          <span>Dark Mode</span>
        </button>
        <div className="relative">
          <button className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center">
            JS
          </button>
        </div>
      </div>
      <div className="flex items-center justify-between text-xs text-secondary">
        <span>v2.3.0</span>
        <span className="text-primary cursor-pointer">Help</span>
      </div>
    </div>
  </div>
);

export default Sidebar;