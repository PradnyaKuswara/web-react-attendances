import type { User } from "@/@types/user";
import {
  IconChevronDown,
  IconLogout,
} from "@tabler/icons-react";
import { getInitial } from "@/helpers/helper";


interface DropdownProfileProps {
  align?: "left" | "right";
  handleLogout: () => void;
  user: User | null;
}

export default function DropdownProfile({
  align = "right",
  handleLogout,
  user,
}: DropdownProfileProps): JSX.Element {
  return (
    <div className={`dropdown ${align === "right" ? "dropdown-end" : "dropdown-start"}`}>
      <button
        tabIndex={0}
        className="btn btn-ghost h-auto min-h-0 rounded-2xl px-2 py-1.5 hover:bg-base-200"
      >
        <div className="avatar">
          <div className="w-10 rounded-2xl bg-primary/10 text-primary">
            <div className="flex h-full w-full items-center justify-center font-semibold">
              {getInitial(user?.full_name, user?.email)}
            </div>
          </div>
        </div>

        <div className="hidden text-left sm:block">
          <div className="text-sm font-semibold leading-tight text-base-content">
            {user?.full_name}
          </div>
          <div className="text-xs text-base-content/60">{user?.role?.name}</div>
        </div>

        <IconChevronDown size={18} className="hidden text-base-content/60 sm:block" />
      </button>

      <ul
        tabIndex={0}
        className="dropdown-content menu z-60 mt-3 w-64 rounded-2xl border border-base-200 bg-base-100 p-2 shadow-xl"
      >
        <li className="pointer-events-none mb-1">
          <div className="flex items-center gap-3 rounded-xl px-3 py-3 opacity-100">
            <div className="avatar">
              <div className="w-12 rounded-2xl bg-primary/10 text-primary">
                <div className="flex h-full w-full items-center justify-center font-semibold">
                  {getInitial(user?.full_name, user?.email)}
                </div>
              </div>
            </div>

            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-base-content">
                {user?.full_name}
              </div>
              <div className="truncate text-xs text-base-content/60">
                {user?.email}
              </div>
            </div>
          </div>
        </li>

        <div className="my-1 h-px bg-base-200" />

        <li>
          <button
            type="button"
            className="rounded-xl text-error hover:bg-error/10 hover:text-error"
            onClick={handleLogout}
          >
            <IconLogout size={18} />
            <span>Logout</span>
          </button>
        </li>
      </ul>
    </div>
  );
}