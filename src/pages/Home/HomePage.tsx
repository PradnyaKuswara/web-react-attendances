const HomePage = () => {
  return (
    <div className="min-h-screen bg-base-200 p-4 md:p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Welcome Section */}
        <div className="rounded-3xl bg-base-100 p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-base-content/60">Welcome back 👋</p>
              <h1 className="mt-1 text-2xl font-bold text-base-content md:text-3xl">
                Attendance Management System
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-base-content/70 md:text-base">
                Kelola absensi harian dengan lebih mudah. Silakan lakukan check-in
                atau langsung masuk ke menu attendance untuk melihat dan mencatat
                kehadiran Anda hari ini.
              </p>
            </div>

            <div className="hidden md:block">
              <div className="rounded-2xl bg-primary/10 px-4 py-3 text-sm font-medium text-primary">
                Ready to Check In
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Content */}
          <div className="space-y-6 lg:col-span-2">
            {/* Main Attendance Card */}
            <div className="rounded-3xl bg-base-100 p-6 shadow-sm">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="space-y-3">
                  <div className="badge badge-primary badge-outline">
                    Attendance Today
                  </div>
                  <h2 className="text-2xl font-bold text-base-content">
                    Start your attendance now
                  </h2>
                  <p className="max-w-xl text-sm leading-relaxed text-base-content/70 md:text-base">
                    Tekan tombol <span className="font-semibold text-primary">Get Time</span>{" "}
                    untuk langsung menuju halaman attendance dan melakukan absensi
                    dengan cepat.
                  </p>

                  <div className="flex flex-wrap gap-3 pt-2">
                    <a
                      href="/attendance"
                      className="btn btn-primary rounded-2xl px-6"
                    >
                      Get Time
                    </a>
                    <a
                      href="/attendance"
                      className="btn btn-outline rounded-2xl px-6"
                    >
                      Open Attendance
                    </a>
                  </div>
                </div>

                <div className="flex justify-center">
                  <img
                    src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=900&auto=format&fit=crop"
                    alt="Attendance Illustration"
                    className="h-48 w-full max-w-xs rounded-3xl object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Quick Menu */}
            <div className="rounded-3xl bg-base-100 p-6 shadow-sm">
              <h3 className="text-lg font-bold text-base-content">Quick Access</h3>
              <p className="mt-1 text-sm text-base-content/60">
                Pilih menu yang ingin Anda akses.
              </p>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <a
                  href="/"
                  className="rounded-2xl border border-base-300 bg-base-200 p-5 transition hover:shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-xl text-primary">
                      🏠
                    </div>
                    <div>
                      <h4 className="font-semibold">Home</h4>
                      <p className="text-sm text-base-content/60">
                        Halaman utama aplikasi
                      </p>
                    </div>
                  </div>
                </a>

                <a
                  href="/attendance"
                  className="rounded-2xl border border-base-300 bg-base-200 p-5 transition hover:shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/10 text-xl text-secondary">
                      ⏱
                    </div>
                    <div>
                      <h4 className="font-semibold">Attendance</h4>
                      <p className="text-sm text-base-content/60">
                        Check-in dan kelola absensi
                      </p>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Status Card */}
            <div className="rounded-3xl bg-base-100 p-6 shadow-sm">
              <h3 className="text-lg font-bold text-base-content">Today Status</h3>
              <div className="mt-4 space-y-4">
                <div className="rounded-2xl bg-base-200 p-4">
                  <p className="text-sm text-base-content/60">Check In</p>
                  <p className="mt-1 text-lg font-bold text-primary">Not Yet</p>
                </div>
                <div className="rounded-2xl bg-base-200 p-4">
                  <p className="text-sm text-base-content/60">Working Status</p>
                  <p className="mt-1 text-lg font-bold text-secondary">Pending</p>
                </div>
              </div>
            </div>

            {/* Info Card */}
            <div className="rounded-3xl bg-primary text-primary-content shadow-sm">
              <div className="p-6">
                <h3 className="text-lg font-bold">Attendance Reminder</h3>
                <p className="mt-2 text-sm leading-relaxed text-primary-content/80">
                  Jangan lupa melakukan absensi tepat waktu agar kehadiran Anda
                  tercatat dengan baik pada sistem.
                </p>
                <a
                  href="/attendance"
                  className="btn mt-4 rounded-2xl border-none bg-base-100 text-base-content hover:bg-base-200"
                >
                  Go to Attendance
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <a
        href="/attendance"
        className="btn btn-primary btn-circle btn-lg fixed bottom-6 right-6 z-50 shadow-xl"
        aria-label="Get Time"
        title="Get Time"
      >
        ⏱
      </a>
    </div>
  );
};

export default HomePage;