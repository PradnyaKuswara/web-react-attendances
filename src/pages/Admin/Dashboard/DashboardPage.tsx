import {
  IconActivity,
  IconCalendarTime,
  IconCheck,
  IconClockHour4,
  IconUsers,
  IconUserCheck,
  IconUserX,
  IconX,
} from "@tabler/icons-react";
import { formatDate, formatTime, getInitial, normalizeStatus } from "@/helpers/helper";
import type { User } from "@/@types/user";
import type { Attendance } from "@/@types/attendance";
import { useGetDashboard } from "@/rests/admin/dashboard/useGetDashboard";

const StatCard = ({
  title,
  value,
  icon,
  hint,
}: {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  hint?: string;
}) => {
  return (
    <div className="card border border-base-200 bg-base-100 shadow-sm">
      <div className="card-body p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-base-content/60">{title}</p>
            <h3 className="mt-2 text-3xl font-bold">{value}</h3>
            {hint ? (
              <p className="mt-1 text-xs text-base-content/50">{hint}</p>
            ) : null}
          </div>

          <div className="grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary">
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
};

const AttendanceBadge = ({ status }: { status?: string }) => {
  const normalized = normalizeStatus(status);

  if (normalized === "present") {
    return <span className="badge badge-success badge-soft">Present</span>;
  }

  if (normalized === "late") {
    return <span className="badge badge-warning badge-soft">Late</span>;
  }

  if (normalized === "absent") {
    return <span className="badge badge-error badge-soft">Absent</span>;
  }

  return <span className="badge badge-ghost">{status || "Unknown"}</span>;
};

const DashboardPage = () => {
  const { data, isLoading, isError } = useGetDashboard();

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div>
          <div className="skeleton mb-2 h-8 w-52" />
          <div className="skeleton h-4 w-80" />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="card border border-base-200 bg-base-100 shadow-sm"
            >
              <div className="card-body p-5">
                <div className="skeleton h-4 w-24" />
                <div className="mt-3 skeleton h-8 w-20" />
                <div className="mt-2 skeleton h-3 w-32" />
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <div className="card border border-base-200 bg-base-100 shadow-sm">
            <div className="card-body">
              <div className="skeleton mb-4 h-6 w-40" />
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="skeleton h-16 w-full" />
                ))}
              </div>
            </div>
          </div>

          <div className="card border border-base-200 bg-base-100 shadow-sm">
            <div className="card-body">
              <div className="skeleton mb-4 h-6 w-40" />
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="skeleton h-16 w-full" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="p-6">
        <div className="alert alert-error">
          <span>Gagal memuat data dashboard.</span>
        </div>
      </div>
    );
  }

  const { stats, recentUsers, recentAttendances } = data;

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="mt-1 text-base-content/60">
            Ringkasan data users dan attendance dalam satu tampilan.
          </p>
        </div>

        <div className="rounded-2xl border border-base-200 bg-base-100 px-4 py-3 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-base-content/50">
            Today
          </p>
          <p className="mt-1 text-sm font-semibold">
            {formatDate(new Date(), "long")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          hint="Semua user terdaftar"
          icon={<IconUsers size={22} />}
        />
        <StatCard
          title="Active Users"
          value={stats.activeUsers}
          hint="User aktif saat ini"
          icon={<IconUserCheck size={22} />}
        />
        <StatCard
          title="Inactive Users"
          value={stats.inactiveUsers}
          hint="User nonaktif"
          icon={<IconUserX size={22} />}
        />
        <StatCard
          title="Total Attendances"
          value={stats.totalAttendances}
          hint="Total record attendance"
          icon={<IconActivity size={22} />}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="card border border-base-200 bg-base-100 shadow-sm">
          <div className="card-body p-5">
            <div className="flex items-center gap-3">
              <div className="grid size-11 place-items-center rounded-2xl bg-success/10 text-success">
                <IconCheck size={20} />
              </div>
              <div>
                <p className="text-sm text-base-content/60">Present Today</p>
                <h3 className="text-2xl font-bold">{stats.presentToday}</h3>
              </div>
            </div>
          </div>
        </div>

        <div className="card border border-base-200 bg-base-100 shadow-sm">
          <div className="card-body p-5">
            <div className="flex items-center gap-3">
              <div className="grid size-11 place-items-center rounded-2xl bg-warning/10 text-warning">
                <IconClockHour4 size={20} />
              </div>
              <div>
                <p className="text-sm text-base-content/60">Late Today</p>
                <h3 className="text-2xl font-bold">{stats.lateToday}</h3>
              </div>
            </div>
          </div>
        </div>

        <div className="card border border-base-200 bg-base-100 shadow-sm">
          <div className="card-body p-5">
            <div className="flex items-center gap-3">
              <div className="grid size-11 place-items-center rounded-2xl bg-error/10 text-error">
                <IconX size={20} />
              </div>
              <div>
                <p className="text-sm text-base-content/60">Absent Today</p>
                <h3 className="text-2xl font-bold">{stats.absentToday}</h3>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="card border border-base-200 bg-base-100 shadow-sm">
          <div className="card-body p-0">
            <div className="border-b border-base-200 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-2xl bg-primary/10 text-primary">
                  <IconUsers size={20} />
                </div>
                <div>
                  <h2 className="font-semibold">Recent Users</h2>
                  <p className="text-sm text-base-content/60">
                    User terbaru yang ditambahkan
                  </p>
                </div>
              </div>
            </div>

            <div className="divide-y divide-base-200">
              {recentUsers.length > 0 ? (
                recentUsers.map((user: User) => (
                  <div
                    key={user.id}
                    className="flex items-center gap-4 px-5 py-4 transition hover:bg-base-200/40"
                  >
                    <div className="avatar">
                      <div className="w-12 rounded-full bg-primary text-primary-content">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.full_name || user.email}
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-sm font-bold">
                            {getInitial(user.full_name, user.email)}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="truncate font-semibold">
                        {user.full_name || "-"}
                      </div>
                      <div className="truncate text-sm text-base-content/60">
                        {user.email}
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <span className="badge badge-primary badge-outline">
                          {user.role?.name || "No Role"}
                        </span>
                        <span
                          className={`badge ${user.is_active
                            ? "badge-success badge-soft"
                            : "badge-error badge-soft"
                            }`}
                        >
                          {user.is_active ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>

                    <div className="text-right text-xs text-base-content/50">
                      {formatDate(user.createdAt, "short")}
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-5 py-10 text-center text-sm text-base-content/60">
                  Belum ada data user.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="card border border-base-200 bg-base-100 shadow-sm">
          <div className="card-body p-0">
            <div className="border-b border-base-200 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-2xl bg-secondary/10 text-secondary">
                  <IconCalendarTime size={20} />
                </div>
                <div>
                  <h2 className="font-semibold">Recent Attendances</h2>
                  <p className="text-sm text-base-content/60">
                    Aktivitas attendance terbaru
                  </p>
                </div>
              </div>
            </div>

            <div className="divide-y divide-base-200">
              {recentAttendances.length > 0 ? (
                recentAttendances.map((attendance: Attendance) => (
                  <div
                    key={attendance.id}
                    className="flex items-center gap-4 px-5 py-4 transition hover:bg-base-200/40"
                  >
                    <div className="avatar">
                      <div className="w-12 rounded-full bg-accent text-accent-content">
                        {attendance.user?.avatar ? (
                          <img
                            src={attendance.user.avatar}
                            alt={
                              attendance.user.full_name || attendance.user.email
                            }
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-sm font-bold">
                            {getInitial(
                              attendance.user?.full_name,
                              attendance.user?.email
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="truncate font-semibold">
                        {attendance.user?.full_name || "-"}
                      </div>
                      <div className="truncate text-sm text-base-content/60">
                        {attendance.user?.email || "-"}
                      </div>

                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <AttendanceBadge status={attendance.status} />
                        <span className="badge badge-ghost">
                          {formatTime(attendance.check_in_at)} -{" "}
                          {formatTime(attendance.check_out_at)}
                        </span>
                      </div>
                    </div>

                    <div className="text-right text-xs text-base-content/50">
                      {formatDate(
                        attendance.date || attendance.created_at,
                        "short"
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-5 py-10 text-center text-sm text-base-content/60">
                  Belum ada data attendance.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;