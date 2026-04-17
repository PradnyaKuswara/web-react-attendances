import {
  IconChevronDown,
  IconLogout,
  IconSettings,
  IconUserCircle,
} from "@tabler/icons-react";
import { Link } from "react-router-dom";

interface DropdownProfileProps {
  align?: "left" | "right";
}

export default function DropdownProfile({
  align = "right",
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
              PK
            </div>
          </div>
        </div>

        <div className="hidden text-left sm:block">
          <div className="text-sm font-semibold leading-tight text-base-content">
            Pradnya
          </div>
          <div className="text-xs text-base-content/60">Administrator</div>
        </div>

        <IconChevronDown size={18} className="hidden text-base-content/60 sm:block" />
      </button>

      <ul
        tabIndex={0}
        className="dropdown-content menu z-[60] mt-3 w-64 rounded-2xl border border-base-200 bg-base-100 p-2 shadow-xl"
      >
        <li className="pointer-events-none mb-1">
          <div className="flex items-center gap-3 rounded-xl px-3 py-3 opacity-100">
            <div className="avatar">
              <div className="w-12 rounded-2xl bg-primary/10 text-primary">
                <div className="flex h-full w-full items-center justify-center font-semibold">
                  PK
                </div>
              </div>
            </div>

            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-base-content">
                Pradnya Kuswara
              </div>
              <div className="truncate text-xs text-base-content/60">
                pradnyakuswara24@gmail.com
              </div>
            </div>
          </div>
        </li>

        <div className="my-1 h-px bg-base-200" />

        <li>
          <Link to="/profile" className="rounded-xl">
            <IconUserCircle size={18} />
            <span>Profile</span>
          </Link>
        </li>

        <li>
          <Link to="/settings" className="rounded-xl">
            <IconSettings size={18} />
            <span>Settings</span>
          </Link>
        </li>

        <div className="my-1 h-px bg-base-200" />

        <li>
          <button
            type="button"
            className="rounded-xl text-error hover:bg-error/10 hover:text-error"
            onClick={() => {
              console.log("logout");
            }}
          >
            <IconLogout size={18} />
            <span>Logout</span>
          </button>
        </li>
      </ul>
    </div>
  );
}