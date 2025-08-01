import UserDashboard from '@/src/components/organism/UserDashboard'
import React from 'react'
import Sidebar from '@/src/components/organism/Sidebar'
import withAuthorization from '@/utils/withAuthorization'

function Index() {
  return (
    <>
      <Sidebar />
      <UserDashboard />
    </>
  )
}

export default withAuthorization(Index, 'user_dashboard')
