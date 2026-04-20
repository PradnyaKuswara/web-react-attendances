import type { User } from './user';

export type AttendanceStatus = 'present' | 'late' | 'absent';

export type Attendance = {
  id: number;
  user_id: number;
  date: string;
  check_in_at: string | Date | null;
  check_out_at: string | Date | null;
  check_in_latitude?: number | null;
  check_in_longitude?: number | null;
  check_out_latitude?: number | null;
  check_out_longitude?: number | null;
  photo_url?: string | null;
  status: AttendanceStatus;
  notes?: string | null;
  created_at?: string | Date;
  updated_at?: string | Date;
  deleted_at?: string | Date | null;
};

export type AttendanceResponseDetail = Response & {
  data: Attendance;
};

export type AttendanceResponseList = Response & {
  data: Attendance[];
};

export type AttendanceInput = {
  user_id: number;
  check_in_latitude: number;
  check_in_longitude: number;
  check_out_latitude: number;
  check_out_longitude: number;
  notes: string;
  photo_url: string;
};
