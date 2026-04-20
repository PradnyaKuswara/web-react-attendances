import { useMemo, useState } from "react";
import { useGetHistoryAttendanceByUser } from "@/rests/attendances/useGetHistoryAttendanceByUser";

type AttendanceStatus = "present" | "late" | "absent";

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

const ITEMS_PER_PAGE = 10;

const getStatusLabel = (status?: AttendanceStatus) => {
  switch (status) {
    case "present":
      return "Hadir";
    case "late":
      return "Terlambat";
    case "absent":
      return "Tidak Hadir";
    default:
      return "-";
  }
};

const getStatusClass = (status?: AttendanceStatus) => {
  switch (status) {
    case "present":
      return "badge-success";
    case "late":
      return "badge-warning";
    case "absent":
      return "badge-error";
    default:
      return "badge-ghost";
  }
};

const formatTime = (value?: string | Date | null) => {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const formatDate = (value?: string | null) => {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
};

const getSummaryText = (item: Attendance) => {
  if (item.status === "absent") return "Tidak ada absensi";

  const checkIn = formatTime(item.check_in_at);
  const checkOut = formatTime(item.check_out_at);

  if (checkIn === "-" && checkOut === "-") {
    return "Belum ada jam absensi";
  }

  return `${checkIn} - ${checkOut}`;
};

const HistoryAttendanceSkeleton = () => {
  return (
    <div className="space-y-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="rounded-3xl border border-base-300 bg-base-100 p-5 shadow-sm"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <div className="skeleton h-5 w-56" />
              <div className="flex gap-2">
                <div className="skeleton h-6 w-20 rounded-full" />
                <div className="skeleton h-6 w-16 rounded-full" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-base-200 px-4 py-3">
                <div className="skeleton h-3 w-16" />
                <div className="mt-2 skeleton h-5 w-14" />
              </div>
              <div className="rounded-2xl bg-base-200 px-4 py-3">
                <div className="skeleton h-3 w-16" />
                <div className="mt-2 skeleton h-5 w-14" />
              </div>
              <div className="col-span-2 rounded-2xl bg-base-200 px-4 py-3 sm:col-span-1">
                <div className="skeleton h-3 w-20" />
                <div className="mt-2 skeleton h-5 w-24" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const EmptyState = () => {
  return (
    <div className="rounded-3xl border border-dashed border-base-300 bg-base-100 p-10 text-center shadow-sm">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-base-200 text-3xl">
        📭
      </div>
      <h3 className="mt-4 text-xl font-bold">Belum ada riwayat absensi</h3>
      <p className="mt-2 text-sm text-base-content/60">
        Data riwayat absensi pengguna belum tersedia.
      </p>
    </div>
  );
};

const ErrorState = ({ message }: { message?: string }) => {
  return (
    <div className="alert alert-error rounded-2xl shadow-sm">
      <span>{message || "Gagal memuat riwayat absensi."}</span>
    </div>
  );
};

const HistoryAttendancePage = () => {
  const { data, isLoading, error } = useGetHistoryAttendanceByUser();
  const [currentPage, setCurrentPage] = useState(1);

  console.log(data, "data");

  const attendances = useMemo(() => {
    const raw = data ?? [];
    return [...raw].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateB - dateA;
    });
  }, [data]);

  const totalItems = attendances.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));

  const paginatedAttendances = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return attendances.slice(startIndex, endIndex);
  }, [attendances, currentPage]);

  const stats = useMemo(() => {
    return attendances.reduce(
      (acc, item) => {
        if (item.status === "present") acc.present += 1;
        if (item.status === "late") acc.late += 1;
        if (item.status === "absent") acc.absent += 1;
        return acc;
      },
      {
        present: 0,
        late: 0,
        absent: 0,
      }
    );
  }, [attendances]);

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(currentPage * ITEMS_PER_PAGE, totalItems);

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const pageNumbers = useMemo(() => {
    const pages: number[] = [];
    const maxVisible = 5;

    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i += 1) {
      pages.push(i);
    }

    return pages;
  }, [currentPage, totalPages]);

  return (
    <div className="min-h-screen bg-base-200">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 p-4 md:p-6">
        <section className="rounded-4xl bg-base-100 shadow-sm">
          <div className="flex flex-col gap-8 px-6 py-8 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <div className="max-w-2xl">
              <div className="badge badge-primary badge-outline mb-4">
                Riwayat Absensi
              </div>

              <h1 className="text-3xl font-bold leading-tight md:text-4xl">
                Semua History Attendance User
              </h1>

              <p className="mt-4 text-sm leading-relaxed text-base-content/70 md:text-base">
                Lihat seluruh riwayat check-in dan check-out pengguna dengan
                tampilan yang rapi, modern, dan mudah dibaca.
              </p>
            </div>

            <div className="grid w-full max-w-xl grid-cols-2 gap-4 lg:grid-cols-4">
              <div className="rounded-3xl bg-primary/10 p-5">
                <p className="text-sm text-base-content/60">Total Data</p>
                <p className="mt-2 text-2xl font-bold text-primary">
                  {totalItems}
                </p>
              </div>

              <div className="rounded-3xl bg-success/10 p-5">
                <p className="text-sm text-base-content/60">Hadir</p>
                <p className="mt-2 text-2xl font-bold text-success">
                  {stats.present}
                </p>
              </div>

              <div className="rounded-3xl bg-warning/10 p-5">
                <p className="text-sm text-base-content/60">Terlambat</p>
                <p className="mt-2 text-2xl font-bold text-warning">
                  {stats.late}
                </p>
              </div>

              <div className="rounded-3xl bg-error/10 p-5">
                <p className="text-sm text-base-content/60">Tidak Hadir</p>
                <p className="mt-2 text-2xl font-bold text-error">
                  {stats.absent}
                </p>
              </div>
            </div>
          </div>
        </section>

        {error ? (
          <ErrorState
            message={
              error instanceof Error ? error.message : "Gagal memuat data."
            }
          />
        ) : null}

        <section className="rounded-4xl bg-base-100 p-6 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold">Daftar Riwayat Absensi</h2>
              <p className="mt-1 text-sm text-base-content/60">
                Menampilkan {startItem}-{endItem} dari {totalItems} data.
              </p>
            </div>

            {/* <div className="badge badge-neutral badge-outline px-4 py-3">
              {response?.message || "Data history attendance"}
            </div> */}
          </div>

          <div className="mt-6">
            {isLoading ? (
              <HistoryAttendanceSkeleton />
            ) : totalItems === 0 ? (
              <EmptyState />
            ) : (
              <div className="space-y-4">
                {paginatedAttendances.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-3xl border border-base-300 bg-base-200/70 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:bg-base-200 hover:shadow-sm"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">
                          {formatDate(item.date)}
                        </h3>

                        <div className="mt-3 flex flex-wrap gap-2">
                          <span
                            className={`badge ${getStatusClass(
                              item.status
                            )} badge-soft`}
                          >
                            {getStatusLabel(item.status)}
                          </span>

                          <span className="badge badge-secondary badge-soft">
                            WFH
                          </span>
                        </div>

                        {item.notes ? (
                          <p className="mt-3 text-sm text-base-content/65">
                            Catatan: {item.notes}
                          </p>
                        ) : null}
                      </div>

                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        <div className="rounded-2xl bg-base-100 px-4 py-3">
                          <p className="text-xs text-base-content/60">
                            Check-in
                          </p>
                          <p className="mt-1 font-semibold">
                            {formatTime(item.check_in_at)}
                          </p>
                        </div>

                        <div className="rounded-2xl bg-base-100 px-4 py-3">
                          <p className="text-xs text-base-content/60">
                            Check-out
                          </p>
                          <p className="mt-1 font-semibold">
                            {formatTime(item.check_out_at)}
                          </p>
                        </div>

                        <div className="col-span-2 rounded-2xl bg-base-100 px-4 py-3 sm:col-span-1">
                          <p className="text-xs text-base-content/60">
                            Ringkasan
                          </p>
                          <p className="mt-1 font-semibold">
                            {getSummaryText(item)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {!isLoading && totalItems > 0 ? (
            <div className="mt-8 flex flex-col gap-4 border-t border-base-200 pt-6 md:flex-row md:items-center md:justify-between">
              <p className="text-sm text-base-content/60">
                Halaman <span className="font-semibold">{currentPage}</span> dari{" "}
                <span className="font-semibold">{totalPages}</span>
              </p>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  className="btn btn-sm rounded-xl"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Sebelumnya
                </button>

                {pageNumbers[0] > 1 ? (
                  <>
                    <button
                      className="btn btn-sm rounded-xl"
                      onClick={() => goToPage(1)}
                    >
                      1
                    </button>
                    {pageNumbers[0] > 2 ? <span className="px-1">...</span> : null}
                  </>
                ) : null}

                {pageNumbers.map((page) => (
                  <button
                    key={page}
                    className={`btn btn-sm rounded-xl ${currentPage === page ? "btn-primary" : "btn-ghost"
                      }`}
                    onClick={() => goToPage(page)}
                  >
                    {page}
                  </button>
                ))}

                {pageNumbers[pageNumbers.length - 1] < totalPages ? (
                  <>
                    {pageNumbers[pageNumbers.length - 1] < totalPages - 1 ? (
                      <span className="px-1">...</span>
                    ) : null}
                    <button
                      className="btn btn-sm rounded-xl"
                      onClick={() => goToPage(totalPages)}
                    >
                      {totalPages}
                    </button>
                  </>
                ) : null}

                <button
                  className="btn btn-sm rounded-xl"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Berikutnya
                </button>
              </div>
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
};

export default HistoryAttendancePage;