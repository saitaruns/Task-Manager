"use client";

import React from "react";
import { Button, buttonVariants } from "./ui/button";
import Link from "next/link";
import { BellDot, ChevronsRight, Loader } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import TaskSheet from "./task-sheet";
import HomeSVG from "../../public/home.svg";
import BoardsSVG from "../../public/boards.svg";
import SettingsSVG from "../../public/settings.svg";
import TeamSVG from "../../public/teams.svg";
import AnalyticsSVG from "../../public/analytics.svg";
import Image from "next/image";
import SolidPlusSVG from "../../public/solidplus.svg";
import useAuth from "@/lib/hooks/useAuth";
import { toast } from "sonner";

const Sidebar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  const user = useAuth();

  const handleLogout = () => {
    toast("Logging out...", {
      duration: 1000,
    });
    localStorage.removeItem("token");
    router.push("/login");
    toast.success("Logged out successfully.");
  };

  return (
    <div className="w-4/12 min-h-screen p-4 flex flex-col gap-5 border-r bg-white">
      <div className="flex items-center gap-2">
        <div className="bg-gray-600 size-8 rounded-md"></div>
        <span className="">{user?.isFetched ? user?.data?.name : ""}</span>
      </div>
      <div className="flex justify-between">
        <div className="flex items-center gap-3 text-[#666666]">
          <BellDot className="cursor-pointer" strokeWidth={1.5} size={24} />
          <Loader className="cursor-pointer" strokeWidth={1.5} size={24} />
          <ChevronsRight
            className="cursor-pointer"
            strokeWidth={1.5}
            size={24}
          />
        </div>
        <Button
          variant="secondary"
          onClick={handleLogout}
          className="text-[#797979] font-[400]"
        >
          Logout
        </Button>
      </div>
      <nav className="flex-grow">
        <ul className="space-y-1">
          {[
            {
              name: "Home",
              icon: HomeSVG,
              route: "/",
            },
            {
              name: "Boards",
              icon: BoardsSVG,
            },
            {
              name: "Settings",
              icon: SettingsSVG,
            },
            {
              name: "Teams",
              icon: TeamSVG,
            },
            {
              name: "Analytics",
              icon: AnalyticsSVG,
            },
          ].map((item) => (
            <li key={item.name}>
              <Link
                href="#"
                className={cn(
                  buttonVariants({
                    variant: "ghost",
                  }),
                  "p-2 text-[#797979] flex justify-start gap-3 border border-transparent hover:border hover:border-[#DDDDDD] hover:bg-[#F4F4F4]",
                  {
                    "border-[#DDDDDD] bg-[#F4F4F4]": pathname === item?.route,
                  }
                )}
              >
                <Image src={item.icon} alt={item.name} width={24} height={24} />
                <span className="font-[400]">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
        <TaskSheet>
          <Button
            variant="shad"
            className="mt-4 w-full gap-2 items-center text-md font-[400] py-5"
          >
            <span>Create new task</span>
            <Image
              src={SolidPlusSVG}
              alt="Create new task"
              width={18}
              height={18}
            />
          </Button>
        </TaskSheet>
      </nav>
    </div>
  );
};

export default Sidebar;
