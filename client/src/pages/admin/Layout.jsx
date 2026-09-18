import React from 'react'
import AdminNavbar from '../../components/admin/AdminNavbar'
import AdminSidebar from '../../components/admin/AdminSidebar'
import { Outlet } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'
import { Navigate } from 'react-router-dom'

const Layout = () => {
  const { isLoaded, user } = useUser()
  if (!isLoaded) return null
  if (user?.publicMetadata?.role !== 'admin') return <Navigate to='/' replace />
  return (
    <div>
        <AdminNavbar/>
        <div className='flex'>
            <AdminSidebar/>
            <div className='flex-2 px-4 py-10 md:px-10 h-[calc(100vh-64px)] overflow-y-auto'>
                    <Outlet/>
            </div>
        </div>
    </div>
  )
}

export default Layout
