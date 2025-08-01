import UserDashboard from '@/src/components/organism/UserDashboard'
import React from 'react'
import Sidebar from '@/src/components/organism/Sidebar'
import withAuthorization from '@/utils/withAuthorization'

function UserPage() {
  return (
    <>
      <Sidebar />
      <UserDashboard />
    </>
  )
}

export default withAuthorization(UserPage, 'user_dashboard')
