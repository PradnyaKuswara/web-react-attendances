export const ROUTE = {
  login: {
    locale: '',
    path: '/login',
    fullPath: `${import.meta.env.VITE_APP_URL}/#/login`,
    name: 'Login',
    description: 'Login',
  },
  home: {
    path: '/home',
    fullPath: `${import.meta.env.VITE_APP_URL}/#/home`,
    name: 'Home',
    description: 'Home',
  },
  attendance: {
    path: '/attendance',
    fullPath: `${import.meta.env.VITE_APP_URL}/#/attendance`,
    name: 'Attendance',
    description: 'Attendance',
  },
  admin: {
    path: '/admin',
    name: 'Admin',
    description: 'Admin',
    dashboard: {
      path: '/admin/dashboard',
      fullPath: `${import.meta.env.VITE_APP_URL}/#/admin/dashboard`,
      name: 'Dashboard',
      description: 'Dashboard',
    },
    managementUsers: {
      path: '/admin/management-users',
      fullPath: `${import.meta.env.VITE_APP_URL}/#/admin/management-users`,
      name: 'Management Users',
      description: 'Management Users',
    },
    managementAttendance: {
      path: '/admin/management-attendance',
      fullPath: `${import.meta.env.VITE_APP_URL}/#/admin/management-attendance`,
      name: 'Management Attendance',
      description: 'Management Attendance',
    },
  },
};
