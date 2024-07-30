import React from "react";
import { Input } from "./ui/input";
import { Search } from "lucide-react";
import { Button } from "./ui/button";
import TaskSheet from "./task-sheet";
import CalendarSVG from "../../public/calendar.svg";
import AutomationSVG from "../../public/automation.svg";
import FilterSVG from "../../public/filter.svg";
import ShareSVG from "../../public/share.svg";
import Image from "next/image";
import SolidPlusSVG from "../../public/solidplus.svg";

const MenuBar = ({
  query,
  setQuery,
}: {
  query: string;
  setQuery: (query: string) => void;
}) => {
  return (
    <div className="flex justify-between">
      <div className="flex gap-1 border border-[#E9E9E9] bg-white items-center pr-2 rounded-md ">
        <Input
          placeholder="Search tasks"
          className="w-fit border-none shadow-none focus-visible:ring-0"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Search size={20} className="text-[#797979]" />
      </div>
      <div className="flex gap-1">
        {[
          {
            name: "Calendar View",
            icon: CalendarSVG,
          },
          {
            name: "Automation",
            icon: AutomationSVG,
          },
          {
            name: "Filter",
            icon: FilterSVG,
          },
          {
            name: "Share",
            icon: ShareSVG,
          },
        ].map((item) => (
          <Button
            variant="ghost"
            key={item.name}
            className="gap-2 text-[#797979] font-[400] text-sm items-center hover:bg-transparent"
          >
            <span>{item.name}</span>
            <Image src={item.icon} alt={item.name} width={22} height={22} />
          </Button>
        ))}
        <TaskSheet>
          <Button variant="shad" className="gap-2">
            <span>Create new</span>
            <Image
              src={SolidPlusSVG}
              alt="Create new task"
              width={18}
              height={18}
            />
          </Button>
        </TaskSheet>
      </div>
    </div>
  );
};

export default MenuBar;
