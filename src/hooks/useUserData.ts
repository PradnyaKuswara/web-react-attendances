import { useEffect, useState, useRef } from 'react';
import AuthModel from '../models/AuthModel';
import { useRecoilState } from 'recoil';
import { KEY } from '../shared/constants/constantStorage';
import useCookies from './useCookies';
import { AttendanceAtom, UserAtom } from '@/shared/atoms/atom';
import AttendancesModel from '@/models/AttendancesModel';

const useUserData = () => {
  const cookies = useCookies();
  const [user, setUser] = useRecoilState(UserAtom);
  const [attendance, setAttendance] = useRecoilState(AttendanceAtom);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const isFetched = useRef(false);
  const intervalRef = useRef<number | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const fetchUser = async (force = false) => {
    if (loading || (isFetched.current && !force)) return user ?? null;

    isFetched.current = true;
    setLoading(true);

    try {
      const response = await AuthModel.authInfo();
      const attendanceResponse = await AttendancesModel.getLastAttendance();

      setUser(response.data);
      setAttendance(attendanceResponse.data);
      setError(null);
      setIsAuthenticated(true);

      return response.data;
    } catch (err: unknown) {
      cookies.removeCookies(KEY.cookie.auth.name, { path: '/' });
      setUser(null);
      setAttendance(null);
      setError(err as Error);
      setIsAuthenticated(false);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchUserWithoutRef = async () => {
    setLoading(true);

    try {
      const response = await AuthModel.authInfo();
      const attendanceResponse = await AttendancesModel.getLastAttendance();

      setUser(response.data);
      setAttendance(attendanceResponse.data);
      setError(null);
      setIsAuthenticated(true);

      return response.data;
    } catch (err: unknown) {
      cookies.removeCookies(KEY.cookie.auth.name, { path: '/' });
      setUser(null);
      setAttendance(null);
      setError(err as Error);
      setIsAuthenticated(false);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();

    intervalRef.current = window.setInterval(
      () => {
        fetchUser(true);
      },
      1000 * 60 * 5,
    );

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    user,
    attendance,
    loading,
    error,
    refetch: fetchUser,
    refetchWithoutRef: fetchUserWithoutRef,
    isAuthenticated,
    setIsAuthenticated,
  };
};

export default useUserData;
