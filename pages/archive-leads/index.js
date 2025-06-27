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

function Index() {
  const [clientIdState, setClientIdState] = React.useState(null)
  const [client, setClient] = React.useState(null)
  const [leads, setLeads] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const router = useRouter()
  const { clientId } = router.query;
  const [openCsv, setOpenCsv] = useState(false);
  const [filters, setFilters] = useState({});


  useEffect(() => {
    async function resolveClientId() {
      setLoading(true);
      try {
        const idToUse = clientId || (await getCurrentUser())._id;
        setClientIdState(idToUse);
        const data = await fetchArchiveLeadByClientId(idToUse, 1, 5, filters);
        setClient(data.client);
        setLeads(data.leads || []);
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
        leads={leads}
        onFilterChange={(name, value) =>
          setFilters((prev) => ({ ...prev, [name]: value }))
        }
      />
      <Popup open={openCsv} onClose={() => setOpenCsv(false)}>
        <CsvWizard />
      </Popup>
    </div>
  )
}

export default Index