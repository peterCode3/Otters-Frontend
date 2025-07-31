import UserDashboard from '@/src/components/organism/UserDashboard'
import React from 'react'
import Sidebar from '@/src/components/organism/Sidebar'
import withAuthorization from '@/utils/withAuthorization'

function index() {
  return (
    <>
      <Sidebar />
      <UserDashboard />
    </>
  )
}

export default withAuthorization(index, 'user_dashboard')
