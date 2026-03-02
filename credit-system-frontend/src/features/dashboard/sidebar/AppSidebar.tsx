"use client";
import * as React from "react";
import { NavUser } from "./NavUser";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavSimple } from "./NavSimple";
import { MenuItems } from "./MenuItems";
import { useAuth } from "@/providers/auth.provider";

interface UserToken {
  role: string;
  email: string;
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();

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
