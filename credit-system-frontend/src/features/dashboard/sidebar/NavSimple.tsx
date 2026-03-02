"use client";
import * as React from "react";
import { type LucideIcon } from "lucide-react";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import Link from "next/link";
export function NavSimple({
  items,
  showExpiring = false,
  daysLeft,
  ...props
}: {
  items: {
    title: string;
    url: string;
    icon: LucideIcon;
    blank?: boolean;
  }[];
  showExpiring?: boolean;
  daysLeft?: number;
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const pathname = usePathname();
  if (!pathname) return null;

  return (
    <SidebarGroup {...props} className="pb-0">
      <SidebarMenu>
        {items.map((item) => {
          const isActive = pathname === item.url;
          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                isActive={isActive}
                className={`transition-all duration-200 ${
                  isActive ? "bg-blue-800" : ""
                } data-[active=true]:text-blue-800 hover:bg-primary/5`}
              >
                <Link
                  href={item.url}
                  target={item.blank ? "_blank" : undefined}
                  className="relative flex items-center gap-2"
                >
                  <span
                    className="absolute left-0 h-full w-0.75 rounded-r-lg bg-primary/10 scale-y-0 origin-bottom transition-transform duration-200 data-[active=true]:scale-y-100"
                    data-active={isActive}
                  />

                  <item.icon
                    className={`transition-transform duration-200 data-[active=true]:scale-110 ${
                      isActive ? "text-blue-800" : "text-black"
                    } `}
                  />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
