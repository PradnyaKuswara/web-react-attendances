import { atom } from 'recoil';
import type { User } from '../../@types/user';
import type { Attendance } from '@/@types/attendance';

export const GlobalLoadingAtom = atom({
  key: 'GlobalLoadingAtom',
  default: false,
});

export const UserAtom = atom<User | null>({
  key: 'UserAtom',
  default: {} as User | null,
});

export const AttendanceAtom = atom<Attendance | null>({
  key: 'AttendanceAtom',
  default: {} as Attendance | null,
});
