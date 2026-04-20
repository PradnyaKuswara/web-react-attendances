import { ROUTE } from "../../shared/constants/constantRoute";
import {
  IconHome,
  IconCalendarTime,
  IconUser,
} from "@tabler/icons-react";
import type { ReactNode } from "react";

export interface SidebarChildItem {
  label: string;
  href: string;
  desc?: string;
}

export interface SidebarMenuItem {
  label: string;
  href: string;
  icon?: ReactNode;
  desc?: string;
  children?: SidebarChildItem[];
}

export interface SidebarMenuGroup {
  groupTitle: string;
  menu: SidebarMenuItem[];
}

const SidebarItem = (): { menus: SidebarMenuGroup[] } => {
  const menus: SidebarMenuGroup[] = [
    {
      groupTitle: "",
      menu: [
        {
          label: ROUTE.admin.dashboard.name,
          href: ROUTE.admin.dashboard.path,
          icon: <IconHome size={20} />,
          desc: "Lihat ringkasan utama aplikasi",
        },
        {
          label: ROUTE.admin.managementUsers.name,
          href: ROUTE.admin.managementUsers.path,
          icon: <IconUser size={20} />,
          desc: "Kelola data user dan role",
        },
        {
          label: ROUTE.admin.managementAttendance.name,
          href: ROUTE.admin.managementAttendance.path,
          icon: <IconCalendarTime size={20} />,
          desc: "Kelola absensi dan riwayat kehadiran",
        },
      ],
    },
  ];

  return {
    menus,
  };
};

export default SidebarItem;