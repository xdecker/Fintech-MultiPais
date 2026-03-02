"use client";
import * as React from "react";
import { NavUser } from "./NavUser";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavSimple } from "./NavSimple";

import { useEffect } from "react";
import { MenuItems } from "./MenuItems";

interface UserToken {
  role: string;
  email: string;
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = React.useState<UserToken>({ role: "", email: "" });

  React.useLayoutEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const parsed = JSON.parse(stored);
        setUser(parsed);
      }
    } catch (err) {
      console.error("Error cargando user del localStorage", err);
    }
  }, []);

  return (
    <Sidebar collapsible="icon" {...props} className="bg-sidebar-altern">
      <SidebarHeader>
        <NavUser user={user} />
      </SidebarHeader>
      <SidebarContent>
        <NavSimple items={MenuItems.navSimple} />
        {/* {user.isSuperAdmin && <NavSimple items={MenuItems.navSimpleAdmin} />} */}
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
