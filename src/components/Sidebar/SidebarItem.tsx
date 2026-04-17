import { ROUTE } from '../../shared/constants/constantRoute';
import {
  IconHome,
  IconCalendarTime,
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
          label: ROUTE.attendance.name,
          href: ROUTE.attendance.path,
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