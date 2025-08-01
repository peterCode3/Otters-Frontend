import React, {useState} from 'react'
import Sidebar from '@/src/components/organism/Sidebar'
import DashboardHeader from '@/src/components/organism/DashboardHeader'
import RolesTable from '@/src/components/organism/AdminDashboard/RolesTable'
import Popup from '@/src/components/organism/Popup'
import CsvWizard from '@/src/components/organism/UploadCSV/CsvWizard'
import RolesPage from '../../src/components/organism/AdminDashboard/Role/CreateRole'
import withAuthorization from '@/utils/withAuthorization'

function RolePage() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Sidebar/>
      <div className="ml-64 p-8 min-h-screen transition-colors bg-[var(--body-background)] text-text">
        <DashboardHeader 
            title="All Roles"
            btnText="Add New Role"
            onButtonClick={() => setOpen(true)}
        />
        <RolesTable/>

      </div>
      <Popup open={open} onClose={() => setOpen(false)}>
        <RolesPage/>
      </Popup>
    </div>
  )
}

export default RolePage
