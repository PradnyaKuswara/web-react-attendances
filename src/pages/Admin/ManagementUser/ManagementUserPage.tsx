import { useGetAllUsers } from '@/rests/admin/users/useGetAllUsers';
import { useMemo, useState } from 'react';

const ITEMS_PER_PAGE = 10;

const ManagementUserPage = () => {
  const { data: users = [], isLoading, isError } = useGetAllUsers();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [page, setPage] = useState(1);

  const filteredUsers = useMemo(() => {
    const keyword = search.toLowerCase();

    return users.filter((user: any) => {
      const matchSearch =
        user.full_name?.toLowerCase().includes(keyword) ||
        user.email?.toLowerCase().includes(keyword) ||
        user.phone?.toLowerCase().includes(keyword) ||
        user.position?.toLowerCase().includes(keyword) ||
        user.role?.name?.toLowerCase().includes(keyword) ||
        user.uuid?.toLowerCase().includes(keyword);

      const matchStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && user.is_active) ||
        (statusFilter === 'inactive' && !user.is_active);

      return matchSearch && matchStatus;
    });
  }, [users, search, statusFilter]);

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);

  const paginatedUsers = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredUsers.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredUsers, page]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleStatusChange = (value: 'all' | 'active' | 'inactive') => {
    setStatusFilter(value);
    setPage(1);
  };

  const getInitial = (name?: string, email?: string) => {
    if (name?.trim()) return name.charAt(0).toUpperCase();
    if (email?.trim()) return email.charAt(0).toUpperCase();
    return 'U';
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="skeleton mb-2 h-8 w-48"></div>
            <div className="skeleton h-4 w-72"></div>
          </div>
          <div className="skeleton h-10 w-32"></div>
        </div>

        <div className="card bg-base-100 border border-base-200 shadow-sm">
          <div className="card-body">
            <div className="mb-4 flex flex-col gap-3 md:flex-row">
              <div className="skeleton h-12 flex-1"></div>
              <div className="skeleton h-12 w-full md:w-52"></div>
            </div>

            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="skeleton h-16 w-full"></div>
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
          <span>Gagal memuat data users.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Management Users</h1>
          <p className="text-base-content/70 mt-1">
            Kelola data pengguna, cari user, filter status, dan lihat detail user.
          </p>
        </div>

        <div className="stats bg-base-100 shadow-sm border border-base-200">
          <div className="stat px-6">
            <div className="stat-title">Total Users</div>
            <div className="stat-value text-primary text-3xl">{users.length}</div>
          </div>
          <div className="stat px-6">
            <div className="stat-title">Active</div>
            <div className="stat-value text-success text-3xl">
              {users.filter((u: any) => u.is_active).length}
            </div>
          </div>
          <div className="stat px-6">
            <div className="stat-title">Inactive</div>
            <div className="stat-value text-error text-3xl">
              {users.filter((u: any) => !u.is_active).length}
            </div>
          </div>
        </div>
      </div>

      <div className="card bg-base-100 border border-base-200 shadow-sm">
        <div className="card-body">
          <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="w-full lg:max-w-md">
              <label className="input input-bordered flex items-center gap-2 w-full">
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
                  placeholder="Cari nama, email, phone, jabatan, role..."
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
                  handleStatusChange(e.target.value as 'all' | 'active' | 'inactive')
                }
              >
                <option value="all">Semua Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div className="text-sm text-base-content/70">
              Menampilkan <span className="font-semibold">{paginatedUsers.length}</span> dari{' '}
              <span className="font-semibold">{filteredUsers.length}</span> user
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
                  <th>Role</th>
                  <th>Position</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.length > 0 ? (
                  paginatedUsers.map((user: any) => (
                    <tr key={user.id} className="hover">
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar">
                            <div className="bg-primary text-primary-content rounded-full w-12">
                              {user.avatar ? (
                                <img src={user.avatar} alt={user.full_name || user.email} />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-sm font-bold">
                                  {getInitial(user.full_name, user.email)}
                                </div>
                              )}
                            </div>
                          </div>

                          <div>
                            <div className="font-semibold">
                              {user.full_name || '-'}
                            </div>
                            <div className="text-sm text-base-content/70">
                              {user.email}
                            </div>
                            <div className="text-xs text-base-content/50">
                              {user.uuid}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td>
                        <div className="badge badge-primary badge-outline">
                          {user.role?.name || `Role #${user.role_id}`}
                        </div>
                      </td>

                      <td>{user.position || '-'}</td>
                      <td>{user.phone || '-'}</td>

                      <td>
                        <div
                          className={`badge ${user.is_active ? 'badge-success' : 'badge-error'
                            } badge-soft`}
                        >
                          {user.is_active ? 'Active' : 'Inactive'}
                        </div>
                      </td>

                      <td>
                        {new Date(user.createdAt).toLocaleDateString('id-ID', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6}>
                      <div className="flex flex-col items-center justify-center py-14 text-center">
                        <div className="mb-3 text-5xl">📭</div>
                        <h3 className="text-lg font-semibold">Data tidak ditemukan</h3>
                        <p className="text-base-content/70 mt-1">
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
                      className={`join-item btn btn-sm ${page === pageNumber ? 'btn-primary' : ''
                        }`}
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
    </div>
  );
};

export default ManagementUserPage;