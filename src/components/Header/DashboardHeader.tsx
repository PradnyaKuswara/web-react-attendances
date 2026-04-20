import { useEffect, useMemo, useRef, useState } from "react";
import {
  IconBell,
  IconMenu2,
  IconMoon,
  IconSearch,
  IconSun,
} from "@tabler/icons-react";
import { useTheme } from "@/hooks/useTheme";
import DropdownProfile from "../Dropdown/DropdownProfile";
import useCookies from "@/hooks/useCookies";
import useGlobalLoading from "@/hooks/useGlobalLoading";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { KEY } from "@/shared/constants/constantStorage";
import { toast } from "react-toastify";
import { ROUTE } from "@/shared/constants/constantRoute";
import { THEME } from "@/shared/constants/constantTheme";
import SidebarItem from "../Sidebar/SidebarItem";

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

function SearchModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}): JSX.Element | null {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const navigate = useNavigate();

  const { menus } = SidebarItem();

  const searchItems: SearchItem[] = useMemo(() => {
    return menus.flatMap((group, groupIndex) =>
      group.menu.flatMap((item, itemIndex) => {
        const parentItem: SearchItem = {
          id: Number(`${groupIndex + 1}${itemIndex + 1}`),
          title: item.label,
          desc: item.desc || `Buka halaman ${item.label}`,
          href: item.href,
        };

        const children =
          item.children?.map((child, childIndex) => ({
            id: Number(`${groupIndex + 1}${itemIndex + 1}${childIndex + 1}`),
            title: child.label,
            desc: child.desc || `${item.label} / ${child.label}`,
            href: child.href,
          })) ?? [];

        return [parentItem, ...children];
      })
    );
  }, [menus]);

  const filteredItems = useMemo(() => {
    const q = query.toLowerCase().trim();

    if (!q) return searchItems;

    return searchItems.filter((item) => {
      return (
        item.title.toLowerCase().includes(q) ||
        item.desc.toLowerCase().includes(q) ||
        item.href.toLowerCase().includes(q)
      );
    });
  }, [query, searchItems]);

  const handleSelect = (item: SearchItem) => {
    const dialog = dialogRef.current;

    if (dialog?.open) {
      dialog.close();
    }

    onClose();

    setTimeout(() => {
      navigate(item.href);
    }, 0);

    setQuery("");
    setSelectedIndex(0);
  };

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    }

    if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    } else {
      setQuery("");
      setSelectedIndex(0);
    }
  }, [open]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const selectedEl = itemRefs.current[selectedIndex];
    selectedEl?.scrollIntoView({
      block: "nearest",
    });
  }, [selectedIndex]);

  useEffect(() => {
    const onGlobalKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (!dialogRef.current?.open) {
          dialogRef.current?.showModal();
          setTimeout(() => inputRef.current?.focus(), 0);
        }
      }
    };

    window.addEventListener("keydown", onGlobalKeyDown);
    return () => window.removeEventListener("keydown", onGlobalKeyDown);
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!filteredItems.length) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setSelectedIndex((prev) =>
        prev + 1 >= filteredItems.length ? 0 : prev + 1
      );
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setSelectedIndex((prev) =>
        prev - 1 < 0 ? filteredItems.length - 1 : prev - 1
      );
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      const selectedItem = filteredItems[selectedIndex];
      if (selectedItem) {
        handleSelect(selectedItem);
      }
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
    }
  };

  return (
    <dialog ref={dialogRef} className="modal" onClose={onClose}>
      <div className="modal-box max-w-2xl rounded-3xl border border-base-200 bg-base-100 p-0 shadow-2xl">
        <div className="border-b border-base-200 p-4">
          <label className="input input-bordered flex h-14 w-full items-center gap-3 rounded-2xl border-base-200 bg-base-100 px-4">
            <IconSearch size={18} className="text-base-content/50" />
            <input
              ref={inputRef}
              type="text"
              className="grow bg-transparent text-sm outline-none"
              placeholder="Cari menu, halaman, atau fitur..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
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
              filteredItems.map((item, index) => {
                const isSelected = index === selectedIndex;

                return (
                  <button
                    key={item.id}
                    ref={(el) => {
                      itemRefs.current[index] = el;
                    }}
                    type="button"
                    onClick={() => handleSelect(item)}
                    className={`flex w-full items-start gap-3 rounded-2xl px-3 py-3 text-left transition ${isSelected
                      ? "bg-primary text-primary-content"
                      : "hover:bg-base-200"
                      }`}
                  >
                    <div
                      className={`mt-0.5 rounded-xl p-2 ${isSelected
                        ? "bg-primary-content/15 text-primary-content"
                        : "bg-primary/10 text-primary"
                        }`}
                    >
                      <IconSearch size={16} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div
                        className={`truncate text-sm font-semibold ${isSelected
                          ? "text-primary-content"
                          : "text-base-content"
                          }`}
                      >
                        {item.title}
                      </div>
                      <div
                        className={`truncate text-xs ${isSelected
                          ? "text-primary-content/80"
                          : "text-base-content/60"
                          }`}
                      >
                        {item.desc}
                      </div>
                    </div>
                  </button>
                );
              })
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
          <span>Gunakan ↑ ↓ untuk navigasi, Enter untuk pilih</span>
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
  const cookies = useCookies();
  const [loading, setLoading] = useGlobalLoading();
  const navigate = useNavigate();
  const { user, refetch } = useAuth();

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

            <button
              type="button"
              onClick={toggleTheme}
              className="btn btn-ghost btn-circle"
              aria-label="Toggle theme"
            >
              {theme === THEME.DARK ? <IconMoon size={20} /> : <IconSun size={20} />}
            </button>

            <div className="ml-1 h-8 w-px bg-base-200" />

            <DropdownProfile align="right" handleLogout={handleLogout} user={user} />
          </div>
        </div>
      </header>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}