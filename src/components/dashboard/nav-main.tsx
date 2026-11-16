"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import type { NavGroup } from "@/types";

export function NavMain({ groups }: { groups: NavGroup[] }) {
  const pathname = usePathname();
  const allUrls = groups.flatMap((group) => group.items.map((item) => item.url));

  // Aktif kalau path sama persis atau berada DI BAWAH url item ("/dashboard/profil/x"
  // untuk "/dashboard/profil"). Kalau ada item lain yang lebih spesifik dan juga
  // cocok (mis. "/dashboard/profil/struktur"), item yang lebih umum tidak ikut aktif.
  function isActive(url: string) {
    if (url === "/dashboard") return pathname === url;

    const matches = pathname === url || pathname.startsWith(`${url}/`);
    if (!matches) return false;

    return !allUrls.some(
      (other) =>
        other.length > url.length &&
        other.startsWith(`${url}/`) &&
        (pathname === other || pathname.startsWith(`${other}/`)),
    );
  }

  return (
    <>
      {groups.map((group) => (
        <SidebarGroup key={group.label}>
          <SidebarGroupLabel className="text-(--shell-muted)/80">
            {group.label}
          </SidebarGroupLabel>
          <SidebarMenu>
            {group.items.map((item) => {
              const active = isActive(item.url);
              return (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    tooltip={{
                      children: item.title,
                      className:
                        "dash-portal bg-popover text-popover-foreground ring-1 ring-white/10 [&>:last-child]:hidden",
                    }}
                    isActive={active}
                    className="text-(--shell-muted) transition-[background-color,color,box-shadow] duration-200 ease-out hover:bg-sidebar-accent/60 hover:text-sidebar-foreground data-active:bg-sidebar-accent data-active:text-white data-active:shadow-[inset_0_0_0_1px_rgb(255_255_255/0.06)] data-active:hover:bg-sidebar-accent"
                    render={<Link href={item.url} />}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </>
  );
}