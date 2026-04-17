import { useEffect, useRef, useState } from "react";
import {
  IconBell,
  IconMenu2,
  IconMoon,
  IconSearch,
  IconSun,
} from "@tabler/icons-react";
import { useTheme } from "@/hooks/useTheme";
import DropdownProfile from "../Dropdown/DropdownProfile";

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

interface SearchItem {
  id: number;
  title: string;
  desc: string;
  href: string;
}

const searchItems: SearchItem[] = [
  {
    id: 1,
    title: "Dashboard",
    desc: "Lihat ringkasan utama aplikasi",
    href: "/",
  },
  {
    id: 2,
    title: "Attendance",
    desc: "Kelola absensi dan riwayat kehadiran",
    href: "/attendance",
  },
  {
    id: 3,
    title: "Profile",
    desc: "Lihat dan edit profil akun",
    href: "/profile",
  },
  {
    id: 4,
    title: "Settings",
    desc: "Atur preferensi aplikasi",
    href: "/settings",
  },
];

function SearchModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}): JSX.Element | null {
  const [query, setQuery] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (!dialogRef.current?.open) {
          dialogRef.current?.showModal();
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const filteredItems = searchItems.filter((item) => {
    const q = query.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q)
    );
  });

  return (
    <dialog
      ref={dialogRef}
      className="modal"
      onClose={onClose}
    >
      <div className="modal-box max-w-2xl rounded-3xl border border-base-200 bg-base-100 p-0 shadow-2xl">
        <div className="border-b border-base-200 p-4">
          <label className="input input-bordered flex h-14 w-full items-center gap-3 rounded-2xl border-base-200 bg-base-100 px-4">
            <IconSearch size={18} className="text-base-content/50" />
            <input
              type="text"
              className="grow bg-transparent text-sm outline-none"
              placeholder="Cari menu, halaman, atau fitur..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
            <kbd className="kbd kbd-sm hidden sm:inline-flex">ESC</kbd>
          </label>
        </div>

        <div className="max-h-[420px] overflow-y-auto p-3">
          <div className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-base-content/50">
            Hasil pencarian
          </div>

          <div className="space-y-1">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  className="flex items-start gap-3 rounded-2xl px-3 py-3 transition hover:bg-base-200"
                  onClick={onClose}
                >
                  <div className="mt-0.5 rounded-xl bg-primary/10 p-2 text-primary">
                    <IconSearch size={16} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold text-base-content">
                      {item.title}
                    </div>
                    <div className="truncate text-xs text-base-content/60">
                      {item.desc}
                    </div>
                  </div>
                </a>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
                <div className="mb-3 rounded-2xl bg-base-200 p-3 text-base-content/60">
                  <IconSearch size={22} />
                </div>
                <p className="text-sm font-semibold">Tidak ada hasil</p>
                <p className="text-xs text-base-content/60">
                  Coba kata kunci lain.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-base-200 px-4 py-3 text-xs text-base-content/50">
          <span>Gunakan Ctrl/Cmd + K untuk membuka pencarian</span>
          <form method="dialog">
            <button className="btn btn-ghost btn-sm rounded-xl">Tutup</button>
          </form>
        </div>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
}

export default function Header({
  sidebarOpen,
  setSidebarOpen,
}: HeaderProps): JSX.Element {
  const [searchOpen, setSearchOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-base-200 bg-base-100/80 backdrop-blur-xl">
        <div className="navbar min-h-18 px-4 lg:px-6">
          <div className="flex flex-1 items-center gap-2">
            <button
              className="btn btn-ghost btn-square lg:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Open sidebar"
            >
              <IconMenu2 size={20} />
            </button>

            <div className="hidden sm:block">
              <h1 className="text-base font-bold text-base-content">Dashboard</h1>
              <p className="text-xs text-base-content/60">
                Welcome back, manage everything from here.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              className="btn btn-ghost hidden h-11 min-h-11 w-72 justify-between rounded-2xl border border-base-200 bg-base-100 px-4 sm:flex"
              onClick={() => setSearchOpen(true)}
            >
              <div className="flex items-center gap-2 text-base-content/60">
                <IconSearch size={18} />
                <span className="text-sm">Search something...</span>
              </div>
              <kbd className="kbd kbd-sm">Ctrl K</kbd>
            </button>

            <button
              className="btn btn-ghost btn-circle sm:hidden"
              onClick={() => setSearchOpen(true)}
              aria-label="Open search"
            >
              <IconSearch size={20} />
            </button>

            <button
              className="btn btn-ghost btn-circle relative"
              aria-label="Notifications"
            >
              <IconBell size={20} />
              <span className="absolute right-2 top-2 size-2 rounded-full bg-error" />
            </button>

            <label className="swap swap-rotate btn btn-ghost btn-circle">
              <input
                type="checkbox"
                onChange={toggleTheme}
                checked={theme === "dark"}
                aria-label="Toggle theme"
              />

              <IconSun className="swap-off" size={20} />
              <IconMoon className="swap-on" size={20} />
            </label>

            <div className="ml-1 h-8 w-px bg-base-200" />

            <DropdownProfile align="right" />
          </div>
        </div>
      </header>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}