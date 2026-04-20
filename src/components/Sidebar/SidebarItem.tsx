import { ROUTE } from '../../shared/constants/constantRoute';
import {
  IconHome,
  IconCalendarTime,
  IconUser,
} from '@tabler/icons-react';

const SidebarItem = () => {
  const menus = [
    {
      groupTitle: "",
      menu: [
        {
          label: ROUTE.home.name,
          href: ROUTE.home.path,
          icon: <IconHome size={20} className="text-primary" />,
        },
        {
          label: ROUTE.admin.managementUsers.name,
          href: ROUTE.admin.managementUsers.path,
          icon: <IconUser size={20} className="text-primary" />,
        },
        {
          label: ROUTE.admin.managementAttendance.name,
          href: ROUTE.admin.managementAttendance.path,
          icon: <IconCalendarTime size={20} className="text-primary" />,
        },
      ],
    },
  ];

  return {
    menus,
  };
};

export default SidebarItem;