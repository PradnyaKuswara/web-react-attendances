import { useMemo, useState } from 'react';
import { useGetAllAttendances } from '@/rests/admin/attendances/useGetAllAttendances';
import type { Attendance } from '@/@types/attendance';
import { formatDate, formatTime, getInitial, normalizeStatus } from '@/helpers/helper';

const ITEMS_PER_PAGE = 10;

const ManagementAttendancesPage = () => {
  const { data: attendances = [], isLoading, isError } = useGetAllAttendances();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'present' | 'late' | 'absent' | 'other'>('all');
  const [page, setPage] = useState(1);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const getStatusBadge = (status?: string) => {
    const normalized = normalizeStatus(status);

    switch (normalized) {
      case 'present':
        return <span className="badge badge-success badge-soft">Present</span>;
      case 'late':
        return <span className="badge badge-warning badge-soft">Late</span>;
      case 'absent':
        return <span className="badge badge-error badge-soft">Absent</span>;
      default:
        return <span className="badge badge-ghost">{status || 'Unknown'}</span>;
    }
  };

  const filteredAttendances = useMemo(() => {
    const keyword = search.toLowerCase();

    return attendances.filter((item: Attendance) => {
      const matchSearch =
        item.user?.full_name?.toLowerCase().includes(keyword) ||
        item.user?.email?.toLowerCase().includes(keyword) ||
        item.user?.position?.toLowerCase().includes(keyword) ||
        item.uuid?.toLowerCase().includes(keyword) ||
        item.status?.toLowerCase().includes(keyword) ||
        item.notes?.toLowerCase().includes(keyword);

      const normalized = normalizeStatus(item.status);

      const matchStatus =
        statusFilter === 'all' ||
        (statusFilter === 'present' && normalized === 'present') ||
        (statusFilter === 'late' && normalized === 'late') ||
        (statusFilter === 'absent' && normalized === 'absent') ||
        (statusFilter === 'other' && normalized === 'other');

      return matchSearch && matchStatus;
    });
  }, [attendances, search, statusFilter]);

  const totalPages = Math.ceil(filteredAttendances.length / ITEMS_PER_PAGE);

  const paginatedAttendances = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredAttendances.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredAttendances, page]);

  const totalPresent = useMemo(
    () => attendances.filter((item: Attendance) => normalizeStatus(item.status) === 'present').length,
    [attendances]
  );

  const totalLate = useMemo(
    () => attendances.filter((item: Attendance) => normalizeStatus(item.status) === 'late').length,
    [attendances]
  );

  const totalAbsent = useMemo(
    () => attendances.filter((item: Attendance) => normalizeStatus(item.status) === 'absent').length,
    [attendances]
  );

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleStatusChange = (
    value: 'all' | 'present' | 'late' | 'absent' | 'other'
  ) => {
    setStatusFilter(value);
    setPage(1);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="skeleton mb-2 h-8 w-56" />
            <div className="skeleton h-4 w-72" />
          </div>
        </div>

        <div className="card border border-base-200 bg-base-100 shadow-sm">
          <div className="card-body">
            <div className="mb-4 flex flex-col gap-3 md:flex-row">
              <div className="skeleton h-12 flex-1" />
              <div className="skeleton h-12 w-full md:w-52" />
            </div>

            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="skeleton h-16 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <div className="alert alert-error">
          <span>Gagal memuat data attendances.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Management Attendances</h1>
          <p className="mt-1 text-base-content/70">
            Kelola data kehadiran user, cari attendance, filter status, dan lihat detail absensi.
          </p>
        </div>

        <div className="stats border border-base-200 bg-base-100 shadow-sm">
          <div className="stat px-6">
            <div className="stat-title">Total Records</div>
            <div className="stat-value text-primary text-3xl">{attendances.length}</div>
          </div>
          <div className="stat px-6">
            <div className="stat-title">Present</div>
            <div className="stat-value text-success text-3xl">{totalPresent}</div>
          </div>
          <div className="stat px-6">
            <div className="stat-title">Late</div>
            <div className="stat-value text-warning text-3xl">{totalLate}</div>
          </div>
          <div className="stat px-6">
            <div className="stat-title">Absent</div>
            <div className="stat-value text-error text-3xl">{totalAbsent}</div>
          </div>
        </div>
      </div>

      <div className="card border border-base-200 bg-base-100 shadow-sm">
        <div className="card-body">
          <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="w-full lg:max-w-md">
              <label className="input input-bordered flex w-full items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="h-4 w-4 opacity-70"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.965 11.026a5.5 5.5 0 1 1 1.06-1.06l3.754 3.754a.75.75 0 1 1-1.06 1.06l-3.754-3.754ZM10.5 6.5a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"
                    clipRule="evenodd"
                  />
                </svg>
                <input
                  type="text"
                  className="grow"
                  placeholder="Cari nama user, email, jabatan, status, catatan..."
                  value={search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                />
              </label>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <select
                className="select select-bordered w-full sm:w-48"
                value={statusFilter}
                onChange={(e) =>
                  handleStatusChange(
                    e.target.value as 'all' | 'present' | 'late' | 'absent' | 'other'
                  )
                }
              >
                <option value="all">Semua Status</option>
                <option value="present">Present</option>
                <option value="late">Late</option>
                <option value="absent">Absent</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div className="text-sm text-base-content/70">
              Menampilkan <span className="font-semibold">{paginatedAttendances.length}</span> dari{' '}
              <span className="font-semibold">{filteredAttendances.length}</span> data attendance
            </div>

            <div className="text-sm text-base-content/70">
              Halaman <span className="font-semibold">{page}</span> dari{' '}
              <span className="font-semibold">{totalPages || 1}</span>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-base-200">
            <table className="table table-zebra">
              <thead className="bg-base-200/60">
                <tr>
                  <th>User</th>
                  <th>Photo</th>
                  <th>Date</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Status</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {paginatedAttendances.length > 0 ? (
                  paginatedAttendances.map((item: Attendance) => (
                    <tr key={item.id} className="hover">
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar">
                            <div className="w-12 rounded-full bg-primary text-primary-content">
                              {item.user?.avatar ? (
                                <img
                                  src={item.user.avatar}
                                  alt={item.user?.full_name || item.user?.email}
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-sm font-bold">
                                  {getInitial(item.user?.full_name, item.user?.email)}
                                </div>
                              )}
                            </div>
                          </div>

                          <div>
                            <div className="font-semibold">
                              {item.user?.full_name || '-'}
                            </div>
                            <div className="text-sm text-base-content/70">
                              {item.user?.email || '-'}
                            </div>
                            <div className="text-xs text-base-content/50">
                              {item.user?.position || '-'}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td>
                        {item.photo_url ? (
                          <img
                            src={item.photo_url}
                            alt={`Attendance photo ${item.user?.full_name || item.user?.email || ''}`}
                            className="h-16 w-16 cursor-pointer rounded-lg border border-base-200 object-cover transition hover:scale-105"
                            onClick={() => setPreviewImage(item.photo_url || '')}
                          />
                        ) : (
                          <span className="text-sm text-base-content/50">-</span>
                        )}
                      </td>

                      <td>{formatDate(item.date || item.created_at)}</td>
                      <td>{formatTime(item.check_in_at)}</td>
                      <td>{formatTime(item.check_out_at)}</td>
                      <td>{getStatusBadge(item.status)}</td>
                      <td className="max-w-xs truncate">{item.notes || '-'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7}>
                      <div className="flex flex-col items-center justify-center py-14 text-center">
                        <div className="mb-3 text-5xl">📭</div>
                        <h3 className="text-lg font-semibold">Data tidak ditemukan</h3>
                        <p className="mt-1 text-base-content/70">
                          Coba ubah kata kunci pencarian atau filter status.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="text-sm text-base-content/70">
                Showing page {page} of {totalPages}
              </div>

              <div className="join">
                <button
                  className="join-item btn btn-sm"
                  disabled={page === 1}
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                >
                  Prev
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .slice(
                    Math.max(page - 3, 0),
                    Math.min(Math.max(page - 3, 0) + 5, totalPages)
                  )
                  .map((pageNumber) => (
                    <button
                      key={pageNumber}
                      className={`join-item btn btn-sm ${page === pageNumber ? 'btn-primary' : ''}`}
                      onClick={() => setPage(pageNumber)}
                    >
                      {pageNumber}
                    </button>
                  ))}

                <button
                  className="join-item btn btn-sm"
                  disabled={page === totalPages}
                  onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {previewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="btn btn-circle btn-sm absolute right-2 top-2 z-10"
              onClick={() => setPreviewImage(null)}
            >
              ✕
            </button>

            <img
              src={previewImage}
              alt="Attendance preview"
              className="max-h-[85vh] max-w-full rounded-xl object-contain shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagementAttendancesPage;