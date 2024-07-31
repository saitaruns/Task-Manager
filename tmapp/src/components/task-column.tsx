import React from "react";
import TaskCard from "./task-card";
import { Button } from "./ui/button";
import { Clock, Plus } from "lucide-react";
import TaskSheet from "./task-sheet";
import ThreeLines from "../../public/threelines.svg";
import Image from "next/image";
import { Droppable } from "react-beautiful-dnd";
import { title } from "@/lib/constants";
import { Skeleton } from "./ui/skeleton";

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: "todo" | "progress" | "review" | "finished";
  priority: "Low" | "Medium" | "Urgent";
  deadline: string;
  metadata?: Object;
  updatedAt: string;
}

export interface TaskColumnProps {
  status: Task["status"];
  tasks?: Task[];
}

const TaskColumn: React.FC<TaskColumnProps> = ({ status, tasks }) => {
  return (
    <Droppable droppableId={status}>
      {(provided) => (
        <div
          className="flex flex-1 w-1/4 flex-col"
          {...provided.droppableProps}
          ref={provided.innerRef}
        >
          <div className="flex justify-between mb-3 items-center">
            <h2 className="text-lg font-[400] text-[#555555]">
              {title[status]}
            </h2>
            <Image src={ThreeLines} alt="Three lines" width={20} height={20} />
          </div>
          {tasks && tasks.length > 0 && (
            <div className="flex flex-col gap-2 mb-4">
              {tasks?.map((task, idx) => (
                <TaskCard key={task._id} idx={idx} {...task} />
              ))}
            </div>
          )}
          {provided.placeholder}
          <TaskSheet status={status}>
            <Button variant="shadsecondary" className="flex justify-between">
              Add new
              <Plus size={16} className="" />
            </Button>
          </TaskSheet>
        </div>
      )}
    </Droppable>
  );
};

export const TaskColumnSkeleton: React.FC<{
  status: Task["status"];
}> = ({ status }) => {
  return (
    <div className="flex flex-1 w-1/4 flex-col">
      <div className="flex justify-between mb-3 items-center">
        <h2 className="text-lg font-[400] text-[#555555]">{title[status]}</h2>
        <Image src={ThreeLines} alt="Three lines" width={20} height={20} />
      </div>
      <div className="space-y-2">
        {[2, 3, 4].slice(0, Math.floor(Math.random() * 3) + 1).map((_, idx) => (
          <div
            key={idx}
            className="p-4 relative group rounded-lg border flex flex-col gap-2 bg-[#F9F9F9] border-[##DEDEDE]"
          >
            <Skeleton className="h-6" />
            <Skeleton className="h-3 " />
            <Skeleton className="h-3 w-9/12" />
            <Skeleton className="h-3 w-7/12" />
            <div className="flex flex-col gap-3">
              <div className="text-sm mt-2 flex gap-2 items-center">
                <Clock size={20} className="inline" />
                <Skeleton className="h-8" />
              </div>
              <Skeleton className="h-3 w-4/12" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskColumn;
