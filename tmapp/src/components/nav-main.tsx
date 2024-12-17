"use client";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { usePathname } from "next/navigation";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon: string;
    isDisabled?: boolean;
  }[];
}) {
  const pathname = usePathname();

  return (
    <SidebarMenu className="px-2">
      {items.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton
            disabled={item.isDisabled}
            isActive={pathname === item.url}
            className="w-full py-0 h-fit"
          >
            <Link
              href={item.url}
              className={cn(
                "flex justify-start gap-2 items-center w-full py-2"
              )}
            >
              <Image
                src={item.icon}
                alt={item.title}
                width="24"
                height="24"
                className="!m-0"
              />
              <span>{item.title}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
