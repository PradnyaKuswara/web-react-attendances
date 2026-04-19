import { useState } from 'react';
import { LuEye, LuEyeOff, LuMail, LuLock } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';
import { ROUTE } from '@/shared/constants/constantRoute';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-base-200">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center p-4 md:p-6">
        <div className="grid w-full max-w-6xl overflow-hidden rounded-4xl border border-base-300 bg-base-100 shadow-2xl lg:grid-cols-2">
          {/* Left Side */}
          <div className="relative hidden flex-col justify-between bg-primary p-10 text-primary-content lg:flex">
            <div className="absolute left-0 top-0 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-52 w-52 rounded-full bg-white/10 blur-3xl" />

            <div className="relative z-10">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-lg font-bold text-primary shadow-lg">
                AMS
              </div>

              <div className="mt-10 max-w-md space-y-4">
                <p className="badge badge-soft badge-lg border-none bg-white/15 text-white">
                  Attendance Management System
                </p>

                <h1 className="text-4xl font-extrabold leading-tight">
                  Welcome back,
                  <br />
                  ready to check in?
                </h1>

                <p className="text-sm leading-relaxed text-primary-content/80 md:text-base">
                  Kelola absensi dengan lebih cepat dan modern. Login untuk
                  melanjutkan ke dashboard attendance dan mulai aktivitas hari ini.
                </p>
              </div>
            </div>

            <div className="relative z-10 grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
                <p className="text-sm text-primary-content/70">Fast Access</p>
                <h3 className="mt-1 text-lg font-semibold">Quick Login</h3>
              </div>
              <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
                <p className="text-sm text-primary-content/70">Daily Use</p>
                <h3 className="mt-1 text-lg font-semibold">Easy Attendance</h3>
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center justify-center bg-base-100 p-6 sm:p-8 md:p-10">
            <div className="w-full max-w-md">
              {/* Mobile Brand */}
              <div className="mb-8 flex items-center gap-3 lg:hidden">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-sm font-bold text-primary-content shadow-md">
                  AMS
                </div>
                <div>
                  <h2 className="text-lg font-bold text-base-content">
                    Attendance Management
                  </h2>
                  <p className="text-sm text-base-content/60">System Login</p>
                </div>
              </div>

              <div className="mb-8 space-y-2">
                <h2 className="text-3xl font-bold text-base-content">Sign in</h2>
                <p className="text-sm text-base-content/60">
                  Masukkan email dan password untuk masuk ke aplikasi.
                </p>
              </div>

              <div className="space-y-5">
                {/* Email */}
                <label className="form-control w-full">
                  <div className="label pb-2">
                    <span className="label-text font-medium">Email</span>
                  </div>
                  <label className="input input-bordered flex h-14 items-center gap-3 rounded-2xl">
                    <LuMail className="text-base-content/50" />
                    <input
                      type="email"
                      className="grow"
                      placeholder="Enter your email"
                    />
                  </label>
                </label>

                {/* Password */}
                <label className="form-control w-full">
                  <div className="label pb-2">
                    <span className="label-text font-medium">Password</span>
                  </div>
                  <label className="input input-bordered flex h-14 items-center gap-3 rounded-2xl">
                    <LuLock className="text-base-content/50" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="grow"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      className="cursor-pointer text-base-content/60 transition hover:text-base-content"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <LuEyeOff size={18} /> : <LuEye size={18} />}
                    </button>
                  </label>
                </label>

                <div className="flex items-center justify-between pt-1">
                  <label className="label cursor-pointer gap-2 p-0">
                    <input type="checkbox" className="checkbox checkbox-primary checkbox-sm" />
                    <span className="label-text text-sm text-base-content/70">
                      Remember me
                    </span>
                  </label>

                  <a
                    href="#"
                    className="text-sm font-medium text-primary transition hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>

                <button
                  className="btn btn-primary h-14 w-full rounded-2xl text-base font-semibold shadow-lg"
                  onClick={() => navigate(ROUTE.attendance.path)}
                >
                  Sign in
                </button>
              </div>

              <div className="divider my-8 text-xs text-base-content/50">SYSTEM ACCESS</div>

              <div className="rounded-2xl bg-base-200 p-4">
                <p className="text-sm text-base-content/60">
                  Attendance Management System
                </p>
                <h3 className="mt-1 font-semibold text-base-content">
                  Modern login for daily attendance workflow
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}