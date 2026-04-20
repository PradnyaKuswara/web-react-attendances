// components/ProtectedRoute.tsx
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { ROUTE } from '../shared/constants/constantRoute';
import useGlobalLoading from '../hooks/useGlobalLoading';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading, error } = useAuth();
  const [, setLoading] = useGlobalLoading();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(loading);
  }, [loading, setLoading]);

  useEffect(() => {
    if (error) navigate(ROUTE.login.path, { replace: true });
  }, [error, navigate]);

  // useEffect(() => {
  //   const isAdmin = user?.role?.name?.toLowerCase().includes('admin');
  //   if (!isAdmin) {
  //     navigate(ROUTE.home.path, { replace: true });
  //   } else {
  //     navigate(ROUTE.admin.dashboard.path, { replace: true });
  //   }
  // }, [user, navigate]);

  return user ? children : null;
};

export default ProtectedRoute