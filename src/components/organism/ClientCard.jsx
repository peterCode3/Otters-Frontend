import { useRouter } from 'next/router';
import { getClientStatus } from '@/utils/clientStatus';

export default function ClientCard({ client }) {
  const status = getClientStatus(client.init_status);
  const router = useRouter();

  const handleOpenLeadsVault = () => {
    router.push(`/leads-vault?clientId=${client._id}`);
  };

  return (
    <div
      className="rounded-lg p-4 transition-shadow"
      style={{
        border: `1px solid var(--client-card-border)`,
        background: 'var(--client-card-bg)',
      }}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center">
          <img
            className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
            style={{
              background: client.iconBg,
              color: client.iconColor,
            }}
            src={client.logo}
          />
          <div>
            <h3 className="font-medium" style={{ color: 'var(--client-card-title)' }}>
              {client.username}
            </h3>
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{
                background: 'var(--client-card-tag-bg)',
                color: 'var(--client-card-tag-text)',
              }}
            >
              {client.industry_tag}
            </span>
          </div>
        </div>
        <span
          className="text-xs px-2 py-1 rounded-full"
          style={{
            background: status.bg,
            color: status.color,
          }}
        >
          {status.label}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div
          className="p-2 rounded"
          style={{ background: 'var(--client-card-metric-bg)' }}
        >
          <p className="text-xs" style={{ color: 'var(--color-secondary)' }}>
            Leads This Week
          </p>
          <p className="font-bold" style={{ color: 'var(--color-black)' }}>{client.leadsThisWeek}</p>
        </div>
        <div
          className="p-2 rounded"
          style={{ background: 'var(--client-card-metric-bg)' }}
        >
          <p className="text-xs" style={{ color: 'var(--color-secondary)' }}>
            Avg IQ Score
          </p>
          <p className="font-bold">{client.avgIqScore}</p>
        </div>
      </div>
      <button
        className="cursor-pointer w-full text-sm border rounded-lg py-1.5"
        style={{
          background: 'var(--client-card-btn-bg)',
          borderColor: 'var(--client-card-btn-border)',
          color: 'var(--client-card-btn-text)',
        }}
        onMouseOver={e => (e.currentTarget.style.background = 'var(--client-card-btn-hover-bg)')}
        onMouseOut={e => (e.currentTarget.style.background = 'var(--client-card-btn-bg)')}
        onClick={handleOpenLeadsVault}

      >
        Open Leads Vault
      </button>
    </div>
  );
}