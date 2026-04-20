import React, { Suspense, useMemo } from 'react';
import { ROUTE } from '../../shared/constants/constantRoute';
import LoginPage from '../../pages/Auth/Login/LoginPage';
import { Navigate, useRoutes, type RouteObject } from 'react-router-dom';
import AppLayout from '../../components/Layout/AppLayout';
// import AttendancePage from '@/pages/Attendance/AttendancePage';s
import HomeLayout from '@/components/Layout/HomeLayout';
import HomePage from '@/pages/Home/HomePage';
import AttendancePage from '@/pages/Attendance/AttendancePage';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import DashboardPage from '@/pages/Admin/Dashboard/DashboardPage';
import ProtectedRoute from '../ProtectedRoute';
import HistoryAttendancePage from '@/pages/HistoryAttendance/HistoryAttendancePage';
import ManagementUserPage from '@/pages/Admin/ManagementUser/ManagementUserPage';

interface Page {
  path: string;
  component: React.ElementType;
}

const useRoute = () => {
  const routes = useMemo(() => {
    const pages: Page[] = [
      { path: ROUTE.login.path, component: LoginPage },
    ];

    const userPages: Page[] = [
      { path: ROUTE.home.path, component: HomePage },
      { path: ROUTE.attendance.path, component: AttendancePage },
      { path: ROUTE.historyAttendance.path, component: HistoryAttendancePage },
    ];

    const dashboardPages: Page[] = [
      { path: ROUTE.admin.dashboard.path, component: DashboardPage },
      { path: ROUTE.admin.managementUsers.path, component: ManagementUserPage },
      // { path: ROUTE.dashboard.managementAttendance.path, component: ManagementAttendancePage },
    ];

    const publicRoutes: RouteObject[] = pages.map(({ path, component: Component }) => ({
      path,
      element: (
        <AppLayout>
          <Suspense fallback={<div>Loading...</div>}>
            <Component />
          </Suspense>
        </AppLayout>
      ),
    }));

    const userRoutes: RouteObject[] = userPages.map(
      ({ path, component: Component }) => ({
        path,
        element: (
          <ProtectedRoute>
            <HomeLayout>
              <Suspense fallback={<div>Loading...</div>}>
                <Component />
              </Suspense>
            </HomeLayout>
          </ProtectedRoute>
        ),
      })
    );

    const dashboardRoutes: RouteObject[] = dashboardPages.map(
      ({ path, component: Component }) => ({
        path,
        element: (
          <ProtectedRoute>
            <DashboardLayout>
              <Suspense fallback={<div>Loading...</div>}>
                <Component />
              </Suspense>
            </DashboardLayout>
          </ProtectedRoute>
        ),
      })
    );

    return [
      {
        path: '/',
        element: <Navigate to={ROUTE.login.path} replace />,
      },
      ...publicRoutes,
      ...userRoutes,
      ...dashboardRoutes,
      {
        path: '*',
        element: <h1>Not Found</h1>,
      },
    ];
  }, []);

  return useRoutes(routes);
};

export default useRoute;