'use client';

import { useEffect, useState } from 'react';
import { getUserLeads } from '@/utils/leadApi';
import { formatDistanceToNowStrict, parseISO } from 'date-fns';
import Link from 'next/link';
import LeadDetailsModal from '../LeadVault/leadview/LeadDetailsModal';

export default function RecentLeads() {
  const [leads, setLeads] = useState([]);
  const [selectedLeadId, setSelectedLeadId] = useState(null);

  useEffect(() => {
    const loadLeads = async () => {
      try {
        const data = await getUserLeads(5);
        setLeads(data.leads || []);
      } catch (err) {
        console.error('Error loading leads', err);
      }
    };
    loadLeads();
  }, []);

  const getStatusLabel = (status) => {
    if (status === 'qualified') return 'Hot';
    if (status === 'review') return 'Warm';
    return 'Cold';
  };

  const getColorVars = (type, value) => {
    let bg = '';
    let text = '';
    if (type === 'iq') {
      if (value >= 7) {
        bg = '--client-card-status-healthy-bg';
        text = '--client-card-status-healthy-text';
      } else if (value >= 5) {
        bg = '--client-card-status-risk-bg';
        text = '--client-card-status-risk-text';
      } else {
        bg = '--client-card-status-poor-bg';
        text = '--client-card-status-poor-text';
      }
    } else if (type === 'intent') {
      if (value === 'High') {
        bg = '--client-card-status-healthy-bg';
        text = '--client-card-status-healthy-text';
      } else if (value === 'Medium') {
        bg = '--client-card-status-risk-bg';
        text = '--client-card-status-risk-text';
      } else {
        bg = '--client-card-status-poor-bg';
        text = '--client-card-status-poor-text';
      }
    } else if (type === 'status') {
      if (value === 'qualified') {
        bg = '--client-card-status-healthy-bg';
        text = '--client-card-status-healthy-text';
      } else if (value === 'review') {
        bg = '--client-card-status-risk-bg';
        text = '--client-card-status-risk-text';
      } else {
        bg = '--client-card-status-poor-bg';
        text = '--client-card-status-poor-text';
      }
    }
    return { bg, text };
  };

  const getSourceIcon = (source) => {
    const src = (source || '').toLowerCase();
    if (src.includes('facebook') || src.includes('meta')) return 'fa-brands fa-facebook text-blue-600';
    if (src.includes('google')) return 'fa-brands fa-google text-red-500';
    if (src.includes('linkedin')) return 'fa-brands fa-linkedin text-blue-700';
    if (src.includes('instagram')) return 'fa-brands fa-instagram text-pink-600';
    return 'fa-solid fa-globe text-green-600';
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    return formatDistanceToNowStrict(parseISO(dateString), { addSuffix: true });
  };

  return (
    <div className="bg-white dark:bg-[var(--table-bg)] rounded-xl p-6 shadow-soft col-span-2">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-bold text-lg text-[var(--table-text)]">Recent Leads</h2>
        <Link href='./leads-vault' className="text-[var(--color-primary)] text-sm flex items-center cursor-pointer">
          Go to Full Vault
          <i className="fa-solid fa-arrow-right ml-1"></i>
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--table-border)]">
              {['Name', 'Source', 'IQ Score', 'Intent', 'Status', 'Received'].map((title) => (
                <th
                  key={title}
                  className="text-left py-3 px-4 text-sm font-medium"
                  style={{ color: 'var(--table-secondary-text)' }}
                >
                  {title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {leads.map((lead, i) => {
              const iqVars = getColorVars('iq', lead.iq_score || 0);
              const intentVars = getColorVars('intent', lead.intent || '');
              const statusVars = getColorVars('status', lead.status || '');
              return (
                <tr key={i} className="border-b border-[var(--table-border)] hover:bg-[var(--table-row-hover)]">
                  {/* Name */}
                  <td className="cursor-pointer py-3 px-4" onClick={() => setSelectedLeadId(lead._id)}>{lead.name || 'Unknown'}</td>

                  {/* Source */}
                  <td className="py-3 px-4">
                    <span className="flex items-center">
                      <i className={`${getSourceIcon(lead.source)} mr-2`}></i>
                      {lead.source || 'Website'}
                    </span>
                  </td>

                  {/* IQ Score */}
                  <td className="py-3 px-4">
                    <span
                      className="px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: `var(${iqVars.bg})`,
                        color: `var(${iqVars.text})`,
                      }}
                    >
                      {lead.iq_score?.toFixed(1) || '0.0'}
                    </span>
                  </td>

                  {/* Intent */}
                  <td className="py-3 px-4">
                    <span
                      className="px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: `var(${intentVars.bg})`,
                        color: `var(${intentVars.text})`,
                      }}
                    >
                      {lead.intent || 'Unknown'}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4">
                    <span
                      className="px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: `var(${statusVars.bg})`,
                        color: `var(${statusVars.text})`,
                      }}
                    >
                      {lead.status}
                    </span>
                  </td>

                  {/* Received */}
                  <td className="py-3 px-4 text-[var(--table-secondary-text)]">
                    {formatTime(lead.date_added)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <LeadDetailsModal
                leadId={selectedLeadId}
                open={!!selectedLeadId}
                onClose={() => setSelectedLeadId(null)}
              />
    </div>
  );
}
