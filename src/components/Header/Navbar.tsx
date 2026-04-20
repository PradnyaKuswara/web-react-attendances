import { useAuth } from "@/hooks/useAuth";
import useCookies from "@/hooks/useCookies";
import useGlobalLoading from "@/hooks/useGlobalLoading";
import { ROUTE } from "@/shared/constants/constantRoute";
import { KEY } from "@/shared/constants/constantStorage";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, refetch } = useAuth();
  const cookies = useCookies();
  const [loading, setLoading] = useGlobalLoading();

  const handleLogout = async () => {
    if (loading) return;
    setLoading(true);

    try {
      cookies.removeCookies(KEY.cookie.auth.name, { path: "/" });
      toast.success("Berhasil logout");
      navigate(ROUTE.login.path);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Terjadi kesalahan"
      );
    } finally {
      await refetch(true);
      setLoading(false);
    }
  };

  return (
    <div className="w-full border-b border-base-200 bg-base-100/95 backdrop-blur">
      <div className="navbar mx-auto max-w-7xl px-4">
        {/* Kiri: Brand */}
        <div className="flex-1">
          <button
            type="button"
            onClick={() => navigate(ROUTE.home.path)}
            className="flex cursor-pointer items-center gap-3 text-base-content no-underline"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-content shadow-md">
              <span className="text-lg font-bold">A</span>
            </div>
            <div className="leading-tight text-left">
              <h1 className="text-base font-bold md:text-lg">
                Manajemen Absensi
              </h1>
              <p className="text-xs text-base-content/60">
                Dashboard Sistem
              </p>
            </div>
          </button>
        </div>

        {/* Tengah: Menu */}
        <div className="hidden md:flex">
          <ul className="menu menu-horizontal gap-2 rounded-full border border-base-200 bg-base-200/40 px-2 py-1">
            <li>
              <button
                type="button"
                onClick={() => navigate(ROUTE.home.path)}
                className="rounded-full px-5 py-2 font-medium transition hover:bg-primary hover:text-primary-content"
              >
                Beranda
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => navigate(ROUTE.attendance.path)}
                className="rounded-full px-5 py-2 font-medium transition hover:bg-primary hover:text-primary-content"
              >
                Absensi
              </button>
            </li>
          </ul>
        </div>

        {/* Kanan: Avatar */}
        <div className="flex flex-1 justify-end">
          <div className="dropdown dropdown-end">
            <button
              type="button"
              tabIndex={0}
              className="btn btn-ghost gap-3 rounded-full px-2 normal-case hover:bg-base-200"
            >
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold leading-4">
                  {user?.full_name ?? "-"}
                </p>
                <p className="text-xs text-base-content/60">
                  {user?.position ?? "-"}
                </p>
              </div>

              <div className="avatar">
                <div className="w-10 rounded-full ring ring-base-200 ring-offset-2 ring-offset-base-100">
                  <img
                    alt="Avatar Pengguna"
                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                  />
                </div>
              </div>
            </button>

            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content z-100 mt-3 w-56 rounded-2xl border border-base-200 bg-base-100 p-2 shadow-xl"
            >
              <li className="menu-title">
                <span>Akun Saya</span>
              </li>

              <li>
                <button
                  type="button"
                  onClick={() => navigate("/profile")}
                  className="rounded-xl text-left"
                >
                  Profil
                </button>
              </li>

              <li>
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loading}
                  className="rounded-xl text-left text-error disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Sedang logout..." : "Logout"}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}