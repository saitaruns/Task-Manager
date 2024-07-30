"use client";

import React from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import AddTaskForm from "./add-task-form";
import { Button } from "./ui/button";
import ShareSVG from "../../public/share.svg";
import Image from "next/image";
import StarSVG from "../../public/star.svg";
import { X } from "lucide-react";
import FullScreenSVG from "../../public/fullscreen.svg";
import { Task } from "./task-column";

const TaskSheet = ({
  children,
  status,
  task,
}: {
  children: React.ReactNode;
  status?: "todo" | "progress" | "review" | "finished";
  task?: Task;
}) => {
  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="!w-[700px] !max-w-none">
        <SheetHeader className="flex-row space-y-0 justify-between">
          <div className="flex items-center gap-4">
            <SheetClose asChild>
              <Button variant="ghost" className="p-0" id="close-sheet">
                <X
                  strokeWidth={1.5}
                  size={24}
                  className="text-[#797979] cursor-pointer"
                />
              </Button>
            </SheetClose>
            <Image
              src={FullScreenSVG}
              alt="Full screen"
              width={14}
              height={14}
              className="cursor-pointer"
              onClick={() => {}}
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => {}}
              className="text-[#797979] font-[400] gap-2"
            >
              <span>Share</span>
              <Image src={ShareSVG} alt="Share" width={18} height={18} />
            </Button>
            <Button
              variant="secondary"
              onClick={() => {}}
              className="text-[#797979] font-[400] gap-2"
            >
              <span>Favorite</span>
              <Image src={StarSVG} alt="Favorite" width={18} height={18} />
            </Button>
          </div>
        </SheetHeader>
        <AddTaskForm task={task} status={status} />
      </SheetContent>
    </Sheet>
  );
};

export default TaskSheet;
