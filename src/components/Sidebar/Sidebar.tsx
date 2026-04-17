import { useMemo, useState, type ReactNode } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { IconChevronRight } from "@tabler/icons-react";
import SidebarItem from "./SidebarItem";

type SidebarVariant = "default" | "v2";

interface SidebarChildItem {
  label: string;
  href: string;
}

interface SidebarMenuItem {
  label: string;
  href: string;
  icon?: ReactNode;
  children?: SidebarChildItem[];
}

interface SidebarMenuGroup {
  groupTitle: string;
  menu: SidebarMenuItem[];
}

interface SidebarItemsResult {
  menus: SidebarMenuGroup[];
}

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  variant?: SidebarVariant;
}

export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  variant = "default",
}: SidebarProps): JSX.Element {
  const { pathname } = useLocation();
  const { menus } = SidebarItem() as SidebarItemsResult;

  const [desktopHovered, setDesktopHovered] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  const isDesktopExpanded = useMemo(() => desktopHovered, [desktopHovered]);

  const sidebarWidthClass = isDesktopExpanded ? "lg:w-72" : "lg:w-20";

  const toggleGroup = (key: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/20 backdrop-blur-sm transition-opacity lg:hidden ${sidebarOpen ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside
        onMouseEnter={() => setDesktopHovered(true)}
        onMouseLeave={() => setDesktopHovered(false)}
        className={[
          "fixed left-0 top-0 z-50 flex h-dvh flex-col border-r bg-base-100 text-base-content shadow-xl transition-all duration-300 ease-out",
          "lg:static lg:z-auto lg:translate-x-0 lg:shadow-none",
          "w-72",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          sidebarWidthClass,
          variant === "v2"
            ? "border-base-300"
            : "border-base-200 lg:rounded-r-3xl",
        ].join(" ")}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b border-base-200 px-3">
          <NavLink
            to="/"
            end
            className={`flex items-center rounded-xl px-2 py-2 transition-all ${isDesktopExpanded ? "gap-3" : "justify-center lg:w-full"
              }`}
          >
            <div className="grid size-10 shrink-0 place-items-center rounded-2xl bg-primary text-primary-content shadow-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={22}
                height={22}
                viewBox="0 0 32 32"
                fill="currentColor"
              >
                <path d="M31.956 14.8C31.372 6.92 25.08.628 17.2.044V5.76a9.04 9.04 0 0 0 9.04 9.04h5.716ZM14.8 26.24v5.716C6.92 31.372.63 25.08.044 17.2H5.76a9.04 9.04 0 0 1 9.04 9.04Zm11.44-9.04h5.716c-.584 7.88-6.876 14.172-14.756 14.756V26.24a9.04 9.04 0 0 1 9.04-9.04ZM.044 14.8C.63 6.92 6.92.628 14.8.044V5.76a9.04 9.04 0 0 1-9.04 9.04H.044Z" />
              </svg>
            </div>

            <div
              className={`overflow-hidden transition-all duration-200 ${isDesktopExpanded
                ? "max-w-[160px] opacity-100"
                : "max-w-0 opacity-0 lg:hidden"
                }`}
            >
              <p className="truncate text-sm font-semibold">Dashboard</p>
              <p className="truncate text-xs text-base-content/50">Admin Panel</p>
            </div>
          </NavLink>

          <button
            type="button"
            className="btn btn-ghost btn-square lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Menu */}
        <div className="flex-1 overflow-y-auto px-3 py-4">
          {menus.map((group, groupIdx) => (
            <section key={groupIdx} className="mb-5">
              <div
                className={`mb-2 px-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-base-content/50 transition-all ${isDesktopExpanded
                  ? "max-h-10 opacity-100"
                  : "max-h-0 overflow-hidden opacity-0"
                  }`}
              >
                {group.groupTitle || "Menu"}
              </div>

              <ul className="space-y-1">
                {group.menu.map((item, idx) => {
                  const groupKey = `${groupIdx}-${idx}`;
                  const hasChildren = !!item.children?.length;
                  const activeChild = item.children?.some((subItem) =>
                    pathname.startsWith(subItem.href)
                  );
                  const isActive =
                    pathname === item.href ||
                    pathname.startsWith(item.href + "/") ||
                    activeChild;

                  const isOpen = openGroups[groupKey] ?? Boolean(activeChild);

                  if (hasChildren) {
                    return (
                      <li key={groupKey}>
                        <button
                          type="button"
                          onClick={() => toggleGroup(groupKey)}
                          className={`group flex w-full items-center rounded-2xl px-3 py-3 text-left transition-all ${isActive
                            ? "bg-primary/10 text-primary"
                            : "text-base-content hover:bg-base-200/70"
                            } ${isDesktopExpanded ? "justify-between" : "justify-center"}`}
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            <span className="shrink-0">{item.icon}</span>

                            <span
                              className={`truncate text-sm font-medium transition-all ${isDesktopExpanded
                                ? "max-w-[140px] opacity-100"
                                : "max-w-0 overflow-hidden opacity-0"
                                }`}
                            >
                              {item.label}
                            </span>
                          </div>

                          <IconChevronRight
                            size={16}
                            className={`shrink-0 transition-all ${isDesktopExpanded ? "opacity-100" : "hidden opacity-0"
                              } ${isOpen ? "rotate-90" : ""}`}
                          />
                        </button>

                        <div
                          className={`overflow-hidden transition-all duration-200 ${isDesktopExpanded && isOpen ? "max-h-96 pt-1" : "max-h-0"
                            }`}
                        >
                          <ul className="ml-11 space-y-1">
                            {item.children?.map((subItem, subIdx) => (
                              <li key={subIdx}>
                                <NavLink
                                  to={subItem.href}
                                  end
                                  onClick={() => setSidebarOpen(false)}
                                  className={({ isActive: subActive }) =>
                                    `block rounded-xl px-3 py-2 text-sm transition-all ${subActive
                                      ? "bg-primary text-primary-content"
                                      : "text-base-content/70 hover:bg-base-200 hover:text-base-content"
                                    }`
                                  }
                                >
                                  {subItem.label}
                                </NavLink>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </li>
                    );
                  }

                  return (
                    <li key={groupKey}>
                      <NavLink
                        to={item.href}
                        end
                        onClick={() => setSidebarOpen(false)}
                        className={({ isActive }) =>
                          [
                            "group flex items-center rounded-2xl px-3 py-3 transition-all",
                            isDesktopExpanded ? "gap-3 justify-start" : "justify-center",
                            isActive || isActive
                              ? "bg-primary text-primary-content shadow-sm"
                              : "text-base-content hover:bg-base-200/70",
                          ].join(" ")
                        }
                      >
                        <span className="shrink-0">{item.icon}</span>

                        <span
                          className={`truncate text-sm font-medium transition-all ${isDesktopExpanded
                            ? "max-w-[140px] opacity-100"
                            : "max-w-0 overflow-hidden opacity-0"
                            }`}
                        >
                          {item.label}
                        </span>
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      </aside>
    </>
  );
}