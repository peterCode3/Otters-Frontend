import DashboardHeader from '@/src/components/organism/DashboardHeader'
import LeadVaultPage from '@/src/components/organism/LeadVault'
import EmptyLeadPage from '@/src/components/organism/LeadVault/EmptyLeadPage'
import Sidebar from '@/src/components/organism/Sidebar'
import React, { useEffect } from 'react'
import { fetchLeadByClientId } from '@/utils/leadApi'
import { useRouter } from 'next/router'
import { getCurrentUser } from '@/utils/userApi'
import { useState } from 'react'
import Popup from '@/src/components/organism/Popup'
import CsvWizard from '@/src/components/organism/UploadCSV/CsvWizard'
import withAuthorization from '@/utils/withAuthorization'

function Index() {
  const [clientIdState, setClientIdState] = React.useState(null)
  const [client, setClient] = React.useState(null)
  const [loading, setLoading] = React.useState(true)
  const router = useRouter()
  const { clientId } = router.query;
  const [openCsv, setOpenCsv] = useState(false);
  

  useEffect(() => {
    async function resolveClientId() {
      setLoading(true);
      if (clientId) {
        setClientIdState(clientId);
        const data = await fetchLeadByClientId(clientId);
        setClient(data.client);
        setLoading(false);
      } else {
        // Get current user and use their id as clientId
        try {
          const user = await getCurrentUser();
          setClientIdState(user.id);
          const data = await fetchLeadByClientId(user.id);
          setClient(data.client);
        } catch {
          setClient(null);
        }
        setLoading(false);
      }
    }
    resolveClientId();
  }, [clientId]);

  if (loading) return <div><EmptyLeadPage/></div>

  return (
    <div className='ml-64 p-8 min-h-screen transition-colors bg-[var(--body-background)] text-text'>
      <Sidebar/>
      <DashboardHeader title='Leads Vault' btnText='Import CSV' onButtonClick={() => setOpenCsv(true)}/>
      <LeadVaultPage clientId={clientIdState}
        description='Are you sure you want to archive lead(s)?'
      />
      <Popup open={openCsv} onClose={() => setOpenCsv(false)}>
              <CsvWizard />
            </Popup>
    </div>
  )
}

export default withAuthorization (Index, 'view_leads')