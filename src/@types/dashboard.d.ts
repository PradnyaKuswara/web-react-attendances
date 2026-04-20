import type { Attendance } from './attendance';
import type { Response } from './response';
import type { User } from './user';

export type DashboardStats = {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  totalAttendances: number;
  presentToday: number;
  lateToday: number;
  absentToday: number;
};

export type DashboardResponse = Response<{
  data: {
    stats: DashboardStats;
    recentUsers: User[];
    recentAttendances: Attendance[];
  };
}>;
