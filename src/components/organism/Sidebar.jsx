import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faOtter,
  faHome,
  faChartBar,
  faCog,
  faMoon,
  faUser
} from '@fortawesome/free-solid-svg-icons';
import Heading from '../atoms/Heading/Heading';
import Paragraph from '../atoms/Paragraph/Paragraph';
import ThemeSwitcher from './ThemeSwitcher';
import Link from 'next/link';
const API = process.env.NEXT_PUBLIC_API_URL;
import { getCurrentUser } from '@/utils/userApi';



// view_leads
// view_archive_leads
// view_users
// view_roles
// user_dashboard
// delete_leads
// register_user
// view_archive_leads


const Sidebar = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch current user for logo
    getCurrentUser()
      .then(data => setUser(data))
      .catch(() => setUser(null));

    console.log(user, 'ai h')

  }, []);

  
const sidebarLinks = [
  { icon: faHome, label: 'Home', link: '/', permission:'admin_dashboard' },
  { icon: faHome, label: 'Home', link: '/user-dashboard', permission:'user_dashboard' },
  { icon: faChartBar, label: 'Leads Vault', link: '/leads-vault', permission: 'view_leads' },
  { icon: faChartBar, label: 'Archive Leads', link: '/archive-leads', permission: 'view_archive_leads' },
  { icon: faChartBar, label: 'Recycle Bin', link: '/recycle-bin', permission: 'delete_leads' },
  { icon: faUser, label: 'All User', link: '/users', permission: 'view_users' },
  { icon: faUser, label: 'All Roles', link: '/role', permission: 'view_roles' },
  { icon: faCog, label: 'Settings', link: '/settings', permission: 'settings' },
];


  return (
    <aside
      className="fixed left-0 top-0 h-full w-64 shadow-soft flex flex-col z-10 transition-colors"
      style={{
        background: 'var(--sidebar-bg)',
        color: 'var(--sidebar-text)',
        borderRight: '1px solid var(--sidebar-hover-bg)',
      }}
    >
      {/* Logo and Branding */}
      <div className="p-6 border-b border-gray-200">
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
          {sidebarLinks
            .filter(link => !link.permission || (user?.permissions?.includes(link.permission)))
            .map(link => {
              const isActive = router.pathname === link.link;
              return (
                <li key={link.label} className="mb-2">
                  <Link href={link.link}
                    className={`w-full flex items-center px-6 py-3 rounded-lg transition-colors font-medium group
              ${isActive
                        ? 'bg-[var(--bg-light-primary)] text-[var(--sidebar-active-text)]'
                        : 'bg-[var(--sidebar-bg)] text-[var(--sidebar-text)] hover:bg-[var(--sidebar-hover-bg)] hover:text-[var(--sidebar-hover-text)]'}`}>
                    <FontAwesomeIcon icon={link.icon} className="mr-3" />
                    {link.label}
                  </Link>
                </li>
              );
            })}
        </ul>

      </nav>
      <div className="mt-auto p-4">
        <ThemeSwitcher />
      </div>
      {/* Bottom Navigation */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <button className="flex items-center text-secondary">
            <FontAwesomeIcon icon={faMoon} className="mr-2" />
            <span>Dark Mode</span>
          </button>
          <div className="relative">
            <Link href="/profile">
              {user && user.logo ? (
                <img
                  src={user.logo}
                  alt="User"
                  className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center object-cover"
                  style={{ border: '2px solid var(--color-primary)' }}
                />
              ) : (
                <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                  {user && user.username
                    ? user.username.charAt(0).toUpperCase()
                    : ''}
                </div>
              )}
            </Link>
          </div>
        </div>
        <div className="flex items-center justify-between text-xs text-secondary">
          <span>v2.3.0</span>
          <span className="text-primary cursor-pointer">Help</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;