import { useMemo } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import type {
  AttendanceInput,
  AttendanceResponseDetail,
} from '../../@types/attendance';
import AttendancesModel from '../../models/AttendancesModel';

const useAttendanceViewModel = () => {
  const schema = useMemo(() => {
    return AttendancesModel.attendanceSchema();
  }, []);

  const form = useForm({
    mode: 'all',
    resolver: yupResolver(schema),
    defaultValues: AttendancesModel.generateDefaultAttendanceInput(),
  });

  const onAttendance = async (
    payload: AttendanceInput,
  ): Promise<AttendanceResponseDetail | Error> => {
    try {
      const res = await AttendancesModel.checkIn(payload);
      console.log(res, res);
      return res;
    } catch (error) {
      if (error instanceof Error) return error;
      return new Error('Unknown error occurred');
    }
  };

  const onCheckoutAttendance = async (
    payload: AttendanceInput,
  ): Promise<AttendanceResponseDetail | Error> => {
    try {
      const res = await AttendancesModel.checkOut(payload);
      return res;
    } catch (error) {
      if (error instanceof Error) return error;
      return new Error('Unknown error occurred');
    }
  };

  return {
    form,
    onAttendance,
    onCheckoutAttendance,
  };
};

export default useAttendanceViewModel;
