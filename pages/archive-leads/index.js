import { useState } from 'react'
import DashboardHeader from '@/src/components/organism/DashboardHeader'
import LeadVaultPage from '@/src/components/organism/LeadVault'
import EmptyLeadPage from '@/src/components/organism/LeadVault/EmptyLeadPage'
import Sidebar from '@/src/components/organism/Sidebar'
import React, { useEffect } from 'react'
import { fetchArchiveLeadByClientId } from '@/utils/archiveleadApi'
import { useRouter } from 'next/router'
import { getCurrentUser } from '@/utils/userApi'
import Popup from '@/src/components/organism/Popup'
import CsvWizard from '@/src/components/organism/UploadCSV/CsvWizard'
import withAuthorization from '@/utils/withAuthorization'

function Index() {
  const [clientIdState, setClientIdState] = React.useState(null)
  const [client, setClient] = React.useState(null)
  const [leads, setLeads] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const router = useRouter()
  const { clientId } = router.query;
  const [openCsv, setOpenCsv] = useState(false);
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);
  const pageSize = 20;


  useEffect(() => {
    async function resolveClientId() {
      setLoading(true);
      try {
        const idToUse = clientId || (await getCurrentUser()).id;
        setClientIdState(idToUse);
        const data = await fetchArchiveLeadByClientId(idToUse, page, pageSize, filters);
        setClient(data.client);
        setLeads(data.leads || []);
        setTotal(data.total)
      } catch {
        setClient(null);
        setLeads([]);
      }
      setLoading(false);
    }

    resolveClientId();
  }, [clientId, filters]);

  
  if (loading) return <div><EmptyLeadPage /></div>

  return (
    <div className='ml-64 p-8 min-h-screen transition-colors bg-[var(--body-background)] text-text'>
      <Sidebar />
      <DashboardHeader title='Archive Leads Vault' btnText='Import CSV' onButtonClick={() => setOpenCsv(true)} />
      <LeadVaultPage
        clientId={clientIdState}
        description="Are you sure you want to restore lead(s)?"
        leads={leads}
        apiSource="archive"
        ArchiveActionText="Restore Archived"
        page={page}
        setPage={setPage}
        pageSize={pageSize}
      />

      <Popup open={openCsv} onClose={() => setOpenCsv(false)}>
        <CsvWizard />
      </Popup>
    </div>
  )
}

export default withAuthorization (Index, 'view_archive_leads')