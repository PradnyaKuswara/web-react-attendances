import React, { useState } from 'react'
import Sidebar from '../Sidebar/Sidebar'
import Header from '../Header/DashboardHeader';
import GlobalLoading from '../GlobalLoading';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <>
      <GlobalLoading />
      <div className="flex h-screen overflow-hidden">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}
        />
        <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <main className="grow bg-base-50 dark:bg-gray-900">
            <div className="px-4 sm:px-6 lg:px-8 py-2 w-full max-w-9xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </>
  )
}

export default DashboardLayout