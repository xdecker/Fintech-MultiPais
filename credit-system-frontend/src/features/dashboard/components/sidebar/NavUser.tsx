"use client";

import {
  BadgeCheck,
  EllipsisVertical,
  LogOut,
  LogOutIcon,
  Sparkles,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { getTwoCapitalLetter } from "@/utils/format";
import { useContext, useState } from "react";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { useLogin } from "@/features/auth/hooks/useLogin";
import { AuthProvider, useAuth } from "@/providers/auth.provider";
import { useRouter } from "next/navigation";

export function NavUser({ user }: any) {
  const { isMobile } = useSidebar();
  const router = useRouter();
  const { logout } = useAuth();
  const [openConfirm, setOpenConfirm] = useState(false);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="relative">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarFallback className="rounded-lg">us</AvatarFallback>
                </Avatar>
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className=" text-xs">{user?.email}</span>
              </div>
              <EllipsisVertical className="text-blue-800 ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarFallback className="rounded-lg">
                    {getTwoCapitalLetter(user?.email ?? "us")}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate text-xs">{user?.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => setOpenConfirm(true)}
            >
              <LogOut />
              Cerrar Sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>

      <ConfirmDialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        onConfirm={() => {
          logout();
          router.replace("/login");
        }}
        title="Cerrar Sesión"
        description="¿Seguro que deseas cerrar sesión?"
        icon={<LogOutIcon className="text-slate-500 w-10 h-10" />}
      />
    </SidebarMenu>
  );
}
