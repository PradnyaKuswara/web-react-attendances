import type { AttendanceStatus } from '@/@types/attendance';

export function generateSessionId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 10);
  return `guest-${timestamp}-${random}`;
}

export const formattedDateCurrent = (currentTime: Date | string) => {
  const date = new Date(currentTime);
  return date.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

export const formattedTimeCurrent = (currentTime: Date) => {
  const date = new Date(currentTime);
  return date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

export const formatTime = (value?: string | Date | null) => {
  if (!value) return '-';
  return formattedTimeCurrent(value as Date);
};

export const formatDate = (value?: string | null) => {
  if (!value) return '-';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
};

export const formattedDateTimeCurrent = (currentTime: Date | string) => {
  const date = new Date(currentTime);
  return date.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

export const getStatusLabel = (status?: AttendanceStatus) => {
  switch (status) {
    case 'present':
      return 'Hadir';
    case 'late':
      return 'Terlambat';
    case 'absent':
      return 'Tidak Hadir';
    default:
      return '-';
  }
};

export const getStatusClass = (status?: AttendanceStatus) => {
  switch (status) {
    case 'present':
      return 'badge-success';
    case 'late':
      return 'badge-warning';
    case 'absent':
      return 'badge-error';
    default:
      return 'badge-ghost';
  }
};
