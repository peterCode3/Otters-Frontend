import React, {useState} from 'react'
import Sidebar from '@/src/components/organism/Sidebar'
import UsersTable from '@/src/components/organism/AdminDashboard/UsersTable'
import DashboardHeader from '@/src/components/organism/DashboardHeader'
import Popup from '@/src/components/organism/Popup'
import AddNewClient from '@/src/components/organism/AddNewClient'
import withAuthorization from '@/utils/withAuthorization'

function index() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Sidebar/>
      <div className="ml-64 p-8 min-h-screen transition-colors bg-[var(--body-background)] text-text">
        <DashboardHeader 
            title="All Clients"
            btnText="Add New Client"
            onButtonClick={() => setOpen(true)}
        />
        <UsersTable/>
      </div>
      <Popup open={open} onClose={() => setOpen(false)}>
              <AddNewClient/>
            </Popup>
    </div>
  )
}

export default withAuthorization(index, 'view_users')
