import React from 'react'
import UserProfile from './profile'
import Sidebar from '@/src/components/organism/Sidebar'

function index() {
  return (
    <div>
      <Sidebar/>
      <div className="ml-64 p-8 min-h-screen transition-colors bg-[var(--body-background)] text-text">
      <UserProfile/>
      </div>
    </div>
  )
}

export default index