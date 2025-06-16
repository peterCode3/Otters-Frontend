import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faOtter,
  faHouse,
  faFolder,
  faHome,
  faChartBar,
  faCog,
  faGear,
  faMoon
} from '@fortawesome/free-solid-svg-icons';
import Heading from '../atoms/Heading/Heading';
import Paragraph from '../atoms/Paragraph/Paragraph';
import ThemeSwitcher from './ThemeSwitcher';

const sidebarLinks = [
  { icon: faHome, label: 'Home' },
  { icon: faChartBar, label: 'Analytics' },
  { icon: faCog, label: 'Settings' },
];

const Sidebar = ({activeIndex = 0, onLinkClick}) => (
  <aside
      className="fixed left-0 top-0 h-full w-64 shadow-soft flex flex-col z-10 transition-colors"
      style={{
        background: 'var(--sidebar-bg)',
        color: 'var(--sidebar-text)',
        borderRight: '1px solid var(--sidebar-hover-bg)',
      }}
    >
    {/* Logo and Branding */}
    <div className={`p-6 border-b 'border-gray-200'}`}>
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
    <nav className="flex-1 p-4">
        <ul>
          {sidebarLinks.map((link, idx) => (
            <li key={link.label} className="mb-2">
              <button
                className="cursor-pointer w-full flex items-center px-6 py-3 rounded-lg transition-colors font-medium"
                style={{
                  background:
                    idx === activeIndex
                      ? 'var(--sidebar-active-bg)'
                      : 'var(--sidebar-bg)',
                  color:
                    idx === activeIndex
                      ? 'var(--sidebar-active-text)'
                      : 'var(--sidebar-text)',
                }}
                onClick={() => onLinkClick && onLinkClick(idx)}
                onMouseOver={e => {
                  if (idx !== activeIndex) {
                    e.currentTarget.style.background = 'var(--sidebar-hover-bg)';
                    e.currentTarget.style.color = 'var(--sidebar-hover-text)';
                  }
                }}
                onMouseOut={e => {
                  if (idx !== activeIndex) {
                    e.currentTarget.style.background = 'var(--sidebar-bg)';
                    e.currentTarget.style.color = 'var(--sidebar-text)';
                  }
                }}
              >
                <FontAwesomeIcon icon={link.icon} className="mr-3" />
                {link.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    <div className="mt-auto p-4">
      <ThemeSwitcher/>
    </div>
    {/* Bottom Navigation */}
    <div className={`p-4 border-t : 'border-gray-200'}`}>
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
  </aside>
);

export default Sidebar;