import type { Attendance } from "@/@types/attendance";
import { formatDate, formatTime, getStatusClass, getStatusLabel } from "@/helpers/helper";
import { useAuth } from "@/hooks/useAuth";
import { ROUTE } from "@/shared/constants/constantRoute";
import { useNavigate } from "react-router-dom";

const getAttendanceSummary = (attendance?: Attendance | null) => {
  if (!attendance) return "Belum ada data absensi";

  if (attendance.status === "absent") return "Tidak ada absensi";

  const checkIn = formatTime(attendance.check_in_at);
  const checkOut = formatTime(attendance.check_out_at);

  if (checkIn === "-" && checkOut === "-") return "Belum ada jam absensi";

  return `${checkIn} - ${checkOut}`;
};

const HomePage = () => {
  const navigate = useNavigate();
  const { attendance } = useAuth() as { attendance?: Attendance | null };

  const latestAttendance = attendance ?? null;
  const latestCheckIn = formatTime(latestAttendance?.check_in_at);
  const latestCheckOut = formatTime(latestAttendance?.check_out_at);
  const latestDate = formatDate(latestAttendance?.date);
  const latestStatusLabel = getStatusLabel(latestAttendance?.status);

  return (
    <div className="min-h-screen bg-base-200">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 p-4 md:p-6">
        <section className="hero rounded-4xl bg-base-100 shadow-sm">
          <div className="hero-content flex-col items-start justify-between gap-8 px-6 py-8 lg:flex-row lg:items-center lg:px-8">
            <div className="max-w-2xl">
              <div className="badge badge-primary badge-outline mb-4">
                Selamat datang kembali 👋
              </div>

              <h1 className="text-3xl font-bold leading-tight md:text-4xl">
                Sistem Manajemen Absensi
              </h1>

              <p className="mt-4 text-sm leading-relaxed text-base-content/70 md:text-base">
                Kelola absensi harian dengan lebih ringkas dan nyaman. Masuk ke
                halaman absensi untuk melakukan check-in atau check-out, lalu
                lihat data absensi terakhir Anda di bawah.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={() => navigate(ROUTE.attendance.path)}
                  className="btn btn-primary rounded-2xl px-6"
                >
                  Masuk ke Absensi
                </button>

                <button
                  onClick={() => navigate(ROUTE.historyAttendance.path)}
                  className="btn btn-ghost rounded-2xl px-6"
                >
                  Lihat Histori Absensi
                </button>
              </div>
            </div>

            <div className="grid w-full max-w-md grid-cols-2 gap-4">
              <div className="rounded-3xl bg-primary/10 p-5">
                <p className="text-sm text-base-content/60">Check-in Terakhir</p>
                <p className="mt-2 text-2xl font-bold text-primary">
                  {latestCheckIn}
                </p>
              </div>

              <div className="rounded-3xl bg-secondary/10 p-5">
                <p className="text-sm text-base-content/60">
                  Check-out Terakhir
                </p>
                <p className="mt-2 text-2xl font-bold text-secondary">
                  {latestCheckOut}
                </p>
              </div>

              <div className="col-span-2 rounded-3xl bg-base-200 p-5">
                <p className="text-sm text-base-content/60">Work Type</p>
                <p className="mt-2 text-lg font-bold text-base-content">WFH</p>
                <p className="mt-2 text-sm leading-relaxed text-base-content/80">
                  Data di halaman ini menggunakan absensi terakhir yang diterima
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-3">
          <div className="space-y-6 xl:col-span-2">
            <section className="rounded-4xl bg-base-100 p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold">Akses Cepat</h2>
                  <p className="mt-1 text-sm text-base-content/60">
                    Pintasan ke halaman yang sering digunakan.
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <button
                  onClick={() => navigate(ROUTE.attendance.path)}
                  className="group rounded-3xl border border-base-300 bg-base-200 p-5 text-left transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-2xl text-primary">
                      ⏱
                    </div>
                    <div>
                      <h3 className="font-semibold">Absensi</h3>
                      <p className="mt-1 text-sm text-base-content/60">
                        Check-in, check-out, dan kelola absensi harian.
                      </p>
                    </div>
                  </div>
                </button>

                <div className="rounded-3xl border border-dashed border-base-300 bg-base-200/60 p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-2xl text-accent">
                      🕘
                    </div>
                    <div>
                      <h3 className="font-semibold">Absensi Terakhir</h3>
                      <p className="mt-1 text-sm text-base-content/60">
                        Menampilkan data check-in dan check-out terakhir dari
                        backend.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-4xl bg-base-100 p-6 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-bold">Absensi Terakhir</h2>
                  <p className="mt-1 text-sm text-base-content/60">
                    Ringkasan data absensi terakhir yang diterima dari API.
                  </p>
                </div>
              </div>

              <div className="mt-5">
                <div className="rounded-3xl border border-base-300 bg-base-200/70 p-5 transition hover:bg-base-200">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <h3 className="font-semibold">{latestDate}</h3>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <span
                          className={`badge ${getStatusClass(
                            latestAttendance?.status
                          )} badge-soft`}
                        >
                          {latestStatusLabel}
                        </span>
                        <span className="badge badge-secondary badge-soft">
                          WFH
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      <div className="rounded-2xl bg-base-100 px-4 py-3">
                        <p className="text-xs text-base-content/60">
                          Check-in Terakhir
                        </p>
                        <p className="mt-1 font-semibold">{latestCheckIn}</p>
                      </div>

                      <div className="rounded-2xl bg-base-100 px-4 py-3">
                        <p className="text-xs text-base-content/60">
                          Check-out Terakhir
                        </p>
                        <p className="mt-1 font-semibold">{latestCheckOut}</p>
                      </div>

                      <div className="col-span-2 rounded-2xl bg-base-100 px-4 py-3 sm:col-span-1">
                        <p className="text-xs text-base-content/60">
                          Ringkasan
                        </p>
                        <p className="mt-1 font-semibold">
                          {getAttendanceSummary(latestAttendance)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <section className="rounded-4xl bg-base-100 p-6 shadow-sm">
              <h2 className="text-lg font-bold">Ringkasan Absensi</h2>

              <div className="mt-4 space-y-4">
                <div className="rounded-2xl bg-base-200 p-4">
                  <p className="text-sm text-base-content/60">
                    Check-in Terakhir
                  </p>
                  <p className="mt-1 text-lg font-bold text-primary">
                    {latestCheckIn}
                  </p>
                </div>

                <div className="rounded-2xl bg-base-200 p-4">
                  <p className="text-sm text-base-content/60">
                    Check-out Terakhir
                  </p>
                  <p className="mt-1 text-lg font-bold">{latestCheckOut}</p>
                </div>

                <div className="rounded-2xl bg-base-200 p-4">
                  <p className="text-sm text-base-content/60">Status</p>
                  <p className="mt-1 text-lg font-bold">{latestStatusLabel}</p>
                </div>

                <div className="rounded-2xl bg-base-200 p-4">
                  <p className="text-sm text-base-content/60">Work Type</p>
                  <p className="mt-1 text-lg font-bold text-secondary">WFH</p>
                </div>

                <div className="rounded-2xl bg-base-200 p-4">
                  <p className="text-sm text-base-content/60">Tanggal</p>
                  <p className="mt-1 text-lg font-bold">{latestDate}</p>
                </div>
              </div>
            </section>

            <section className="rounded-4xl bg-primary text-primary-content shadow-sm">
              <div className="p-6">
                <h2 className="text-lg font-bold">Lanjut ke absensi?</h2>
                <p className="mt-2 text-sm leading-relaxed text-primary-content/80">
                  Masuk ke halaman absensi untuk melakukan check-in atau
                  check-out sesuai kebutuhan Anda.
                </p>
                <button
                  onClick={() => navigate(ROUTE.attendance.path)}
                  className="btn mt-4 rounded-2xl border-none bg-base-100 text-base-content hover:bg-base-200"
                >
                  Buka Absensi
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;