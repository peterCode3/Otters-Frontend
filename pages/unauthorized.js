import Sidebar from '@/src/components/organism/Sidebar';
import Link from 'next/link';

const UnauthorizedPage = () => {
  return (
    <div>
      
    <Sidebar/>
    <div className="min-h-screen flex items-center justify-center p-6 ml-64 transition-colors bg-[var(--body-background)] text-text">
      <div className="bg-white dark:bg-[var(--card-bg)] rounded-xl shadow-soft p-10 max-w-lg text-center space-y-6 border border-[var(--sidebar-hover-bg)]">
        <div className="text-6xl font-bold text-[var(--color-danger)]">🚫</div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--dashboard-header-title)' }}>
          Access Denied
        </h1>
        <p className="text-[var(--color-secondary)]">
          You do not have permission to access this page.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 rounded-lg bg-[var(--dashboard-header-btn-bg)] text-[var(--dashboard-header-btn-text)] font-medium hover:opacity-90 transition"
        >
          Go Back to Dashboard
        </Link>
      </div>
    </div>
    </div>
  );
};

export default UnauthorizedPage;
