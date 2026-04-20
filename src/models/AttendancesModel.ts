import type {
  AttendanceInput,
  AttendanceResponseDetail,
  AttendanceResponseList,
} from '@/@types/attendance';
import { ApiClient } from '@/services/ApiClient';
import * as yup from 'yup';

class AttendancesModel {
  private static instance: AttendancesModel;
  private apiClient: ApiClient;

  private constructor() {
    this.apiClient = ApiClient.getInstance();
  }

  public static getInstance(): AttendancesModel {
    if (!AttendancesModel.instance) {
      AttendancesModel.instance = new AttendancesModel();
    }
    return AttendancesModel.instance;
  }

  attendanceSchema() {
    return yup.object({
      check_in_latitude: yup.number().required('Latitude is required'),
      check_in_longitude: yup.number().required('Longitude is required'),
      check_out_latitude: yup.number().optional(),
      check_out_longitude: yup.number().optional(),
      notes: yup.string().required('Notes is required'),
      photo_url: yup.string().optional(),
    });
  }

  generateDefaultAttendanceInput() {
    return {
      check_in_latitude: 0,
      check_in_longitude: 0,
      check_out_latitude: 0,
      check_out_longitude: 0,
      notes: '',
      photo_url: '',
    };
  }

  public async checkIn(
    data: AttendanceInput,
  ): Promise<AttendanceResponseDetail> {
    return this.apiClient.post('/users/attendances/check-in', data, true);
  }

  public async checkOut(data: {
    check_out_latitude: number;
    check_out_longitude: number;
    notes: string;
    photo_url: string;
  }): Promise<AttendanceResponseDetail> {
    return this.apiClient.post('/users/attendances/check-out', data, true);
  }

  public async getLastAttendance(): Promise<AttendanceResponseDetail> {
    return this.apiClient.get('/users/attendances/last', true);
  }

  public async getAttendances(): Promise<AttendanceResponseList> {
    return this.apiClient.get('/users/attendances', true);
  }

  public async getAttendancesByAdmin(): Promise<AttendanceResponseList> {
    return this.apiClient.get('/admin/attendances', true);
  }
}

export default AttendancesModel.getInstance();
