import DashboardHeader from '@/src/components/organism/DashboardHeader'
import LeadVaultPage from '@/src/components/organism/LeadVault'
import EmptyLeadPage from '@/src/components/organism/LeadVault/EmptyLeadPage'
import Sidebar from '@/src/components/organism/Sidebar'
import React, { useEffect } from 'react'
import { fetchLeadByClientId } from '@/utils/leadApi'
import { useRouter } from 'next/router'

function index() {
  const [client, setClient] = React.useState(null)
  const [loading, setLoading] = React.useState(true)
  const router = useRouter()
  const { clientId } = router.query;

  useEffect(() => {
    setLoading(true)
    fetchLeadByClientId(clientId).then((data) => {
      setClient(data.client)
      setLoading(false)
    })
  }, []);

  if (loading) return <div><EmptyLeadPage/></div>



  return (
    <div className='ml-64 p-8 min-h-screen transition-colors bg-[var(--body-background)] text-text'>
      <Sidebar/>
      <DashboardHeader title='Leads Vault' btnText='Import CSV' />
      <LeadVaultPage clientId={clientId}/>
    </div>
  )
}

export default index