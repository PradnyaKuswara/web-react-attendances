import { useEffect, useState } from 'react';
import { Controller } from 'react-hook-form';
import { LuEye, LuEyeOff, LuMail, LuLock } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';
import { ROUTE } from '@/shared/constants/constantRoute';
import useLoginViewModel from './useLoginViewModel';
import useGlobalLoading from '@/hooks/useGlobalLoading';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'react-toastify';
import TextInput from '@/components/FormInput/TextInput';

export default function LoginPage() {
  const { form, onLogin } = useLoginViewModel();
  const [loading, setLoading] = useGlobalLoading();
  const [showPassword, setShowPassword] = useState(false);
  const {
    isAuthenticated,
    loading: loadingUser,
    refetch: refetchUser,
    user,
  } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loadingUser && isAuthenticated && user) {
      if (user?.role?.name?.toLowerCase().includes('admin')) {
        navigate(ROUTE.admin.dashboard.path, { replace: true });
      } else {
        navigate(ROUTE.home.path, { replace: true });
      }
    }
  }, [loadingUser, isAuthenticated, user, navigate]);

  const handleSubmit = async () => {
    if (loading) return;

    const isValid = await form.trigger();
    if (!isValid) return;

    setLoading(true);

    const res = await onLogin(form.getValues());

    if (res instanceof Error) {
      toast.error(res.message);
      setLoading(false);
      return;
    }

    try {
      const freshUser = await refetchUser(true);

      console.log(freshUser, 'freshUser');

      if (!freshUser) {
        toast.error('Gagal memperbarui data pengguna');
        setLoading(false);
        return;
      }

      toast.success('Login berhasil');

      if (freshUser?.role?.name?.toLowerCase().includes('admin')) {
        navigate(ROUTE.admin.dashboard.path, { replace: true });
      } else {
        navigate(ROUTE.home.path, { replace: true });
      }
    } catch (e) {
      console.error('Gagal memuat ulang data pengguna:', e);
      toast.error('Gagal memperbarui data pengguna');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center p-4 md:p-6">
        <div className="grid w-full max-w-6xl overflow-hidden rounded-4xl border border-base-300 bg-base-100 shadow-2xl lg:grid-cols-2">
          <div className="relative hidden flex-col justify-between bg-primary p-10 text-primary-content lg:flex">
            <div className="absolute left-0 top-0 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-52 w-52 rounded-full bg-white/10 blur-3xl" />

            <div className="relative z-10">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-lg font-bold text-primary shadow-lg">
                AMS
              </div>

              <div className="mt-10 max-w-md space-y-4">
                <p className="badge badge-soft badge-lg border-none bg-white/15 text-white">
                  Sistem Manajemen Absensi
                </p>

                <h1 className="text-4xl font-extrabold leading-tight">
                  Selamat datang kembali,
                  <br />
                  siap untuk check-in?
                </h1>

                <p className="text-sm leading-relaxed text-primary-content/80 md:text-base">
                  Kelola absensi dengan lebih cepat dan modern. Login untuk
                  melanjutkan ke dashboard absensi dan mulai aktivitas hari ini.
                </p>
              </div>
            </div>

            <div className="relative z-10 grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
                <p className="text-sm text-primary-content/70">Akses Cepat</p>
                <h3 className="mt-1 text-lg font-semibold">Login Cepat</h3>
              </div>
              <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
                <p className="text-sm text-primary-content/70">
                  Penggunaan Harian
                </p>
                <h3 className="mt-1 text-lg font-semibold">Absensi Mudah</h3>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center bg-base-100 p-6 sm:p-8 md:p-10">
            <div className="w-full max-w-md">
              <div className="mb-8 flex items-center gap-3 lg:hidden">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-sm font-bold text-primary-content shadow-md">
                  AMS
                </div>
                <div>
                  <h2 className="text-lg font-bold text-base-content">
                    Sistem Manajemen Absensi
                  </h2>
                  <p className="text-sm text-base-content/60">Halaman Login</p>
                </div>
              </div>

              <div className="mb-8 space-y-2">
                <h2 className="text-3xl font-bold text-base-content">Masuk</h2>
                <p className="text-sm text-base-content/60">
                  Masukkan email dan password untuk masuk ke aplikasi.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <Controller
                  control={form.control}
                  name="email"
                  render={({ field, fieldState }) => {
                    const type = 'email';
                    const placeHolder = 'Masukkan email Anda';
                    const label = 'Email';
                    const isLabel = true;

                    return (
                      <TextInput
                        props={{
                          field,
                          fieldState,
                          type,
                          placeHolder,
                          label,
                          isLabel,
                          icon: <LuMail className="text-base-content/50" />,
                        }}
                      />
                    );
                  }}
                />

                <Controller
                  control={form.control}
                  name="password"
                  render={({ field, fieldState }) => {
                    const type = showPassword ? 'text' : 'password';
                    const placeHolder = 'Masukkan password Anda';
                    const label = 'Password';
                    const isLabel = true;

                    return (
                      <TextInput
                        props={{
                          field,
                          fieldState,
                          type,
                          placeHolder,
                          label,
                          isLabel,
                          icon: <LuLock className="text-base-content/50" />,
                          rightElement: (
                            <button
                              type="button"
                              className="cursor-pointer text-base-content/60 transition hover:text-base-content"
                              onClick={() =>
                                setShowPassword((prev) => !prev)
                              }
                              aria-label={
                                showPassword
                                  ? 'Sembunyikan password'
                                  : 'Tampilkan password'
                              }
                            >
                              {showPassword ? (
                                <LuEyeOff size={18} />
                              ) : (
                                <LuEye size={18} />
                              )}
                            </button>
                          ),
                        }}
                      />
                    );
                  }}
                />

                {/* <div className="flex items-center justify-between pt-1">
                  <label className="label cursor-pointer gap-2 p-0">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-primary checkbox-sm"
                    />
                  </label>
                </div> */}

                <button
                  type="button"
                  className="btn btn-primary h-14 w-full rounded-2xl text-base font-semibold shadow-lg"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? 'Memuat...' : 'Masuk'}
                </button>
              </div>

              <div className="divider my-8 text-xs text-base-content/50">
                AKSES SISTEM
              </div>

              <div className="rounded-2xl bg-base-200 p-4">
                <p className="text-sm text-base-content/60">
                  Sistem Manajemen Absensi
                </p>
                <h3 className="mt-1 font-semibold text-base-content">
                  Login modern untuk alur kerja absensi harian
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}