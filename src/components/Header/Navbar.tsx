export default function Navbar() {
  return (
    <div className="w-full border-b border-base-200 bg-base-100/95 backdrop-blur">
      <div className="navbar mx-auto max-w-7xl px-4">
        {/* Left: Brand */}
        <div className="flex-1">
          <a className="flex items-center gap-3 text-base-content no-underline">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-content shadow-md">
              <span className="text-lg font-bold">A</span>
            </div>
            <div className="leading-tight">
              <h1 className="text-base font-bold md:text-lg">
                Attendance Management
              </h1>
              <p className="text-xs text-base-content/60">System Dashboard</p>
            </div>
          </a>
        </div>

        {/* Center: Menu */}
        <div className="hidden md:flex">
          <ul className="menu menu-horizontal gap-2 rounded-full border border-base-200 bg-base-200/40 px-2 py-1">
            <li>
              <a
                href="/"
                className="rounded-full px-5 py-2 font-medium transition hover:bg-primary hover:text-primary-content"
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="/attendance"
                className="rounded-full px-5 py-2 font-medium transition hover:bg-primary hover:text-primary-content"
              >
                Attendance
              </a>
            </li>
          </ul>
        </div>

        {/* Right: Avatar */}
        <div className="flex flex-1 justify-end">
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost gap-3 rounded-full px-2 normal-case hover:bg-base-200"
            >
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold leading-4">Admin</p>
                <p className="text-xs text-base-content/60">Administrator</p>
              </div>
              <div className="avatar">
                <div className="w-10 rounded-full ring ring-base-200 ring-offset-2 ring-offset-base-100">
                  <img
                    alt="User Avatar"
                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                  />
                </div>
              </div>
            </div>

            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content z-[1] mt-3 w-56 rounded-2xl border border-base-200 bg-base-100 p-2 shadow-xl"
            >
              <li className="menu-title">
                <span>My Account</span>
              </li>
              <li>
                <a className="rounded-xl">Profile</a>
              </li>
              <li>
                <a className="rounded-xl text-error">Logout</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}