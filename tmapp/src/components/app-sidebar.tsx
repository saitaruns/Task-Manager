"use client";

import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import TaskSheet from "./task-sheet";
import HomeSVG from "../../public/home.svg";
import BoardsSVG from "../../public/boards.svg";
import SettingsSVG from "../../public/settings.svg";
import TeamSVG from "../../public/teams.svg";
import Image from "next/image";
import SolidPlusSVG from "../../public/solidplus.svg";
import { toast } from "sonner";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";


const data = {
  navMain: [
    {
      title: "Home",
      url: "/",
      icon: HomeSVG,
      isDisabled: false,
    },
    {
      title: "Boards",
      url: "/boards",
      icon: BoardsSVG,
      isDisabled: true,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: SettingsSVG,
      isDisabled: true,
    },
    {
      title: "Teams",
      url: "/teams",
      icon: TeamSVG,
      isDisabled: true,
    },
  ],
};

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user?: any;
}

export function AppSidebar({ ...props }: AppSidebarProps) {
  const router = useRouter();

  const handleLogout = () => {
    toast("Logging out...", {
      duration: 1000,
    });
    localStorage.removeItem("token");
    router.push("/login");
    toast.success("Logged out successfully.");
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              asChild
            >
              <Link href="/" className="flex items-center gap-2 px-2">
                <span>
                  Task Manager
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <TaskSheet>
            <SidebarMenuButton
              asChild
            >
              <Button
                variant="shad"
                className="mt-4 w-10/12 mx-auto items-center text-md py-5 hover:text-white active:text-white"
              >
                <Image
                  src={SolidPlusSVG}
                  alt="Create new task"
                  width={18}
                  height={18}
                />
                <span>Create new task</span>
              </Button>
            </SidebarMenuButton>
          </TaskSheet>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={null} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
