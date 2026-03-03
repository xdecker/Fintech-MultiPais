import {
  BookOpen,
  Bot,
  Users,
  Frame,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  Cog,
  Bell,
  ClipboardPlus,
  CalendarRange,
  Home,
  Sparkles,
  BadgeInfo,
  FileUser,
  UserCircle,
  ClipboardCheck,
  Hospital,
} from "lucide-react";

export const MenuItems = {
  navSimple: [
    {
      title: "Inicio",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "Creditos Solicitados",
      url: "/dashboard/credit-requests",
      icon: CalendarRange,
    },
  ],

  navSimpleAdmin: [
    {
      title: "Usuarios Activos",
      url: "/dashboard/admin/usuarios",
      icon: UserCircle,
    },
  ],
};
