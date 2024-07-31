import React from "react";
import TaskCard from "./task-card";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import TaskSheet from "./task-sheet";
import ThreeLines from "../../public/threelines.svg";
import Image from "next/image";
import { Droppable } from "react-beautiful-dnd";
import { title } from "@/lib/constants";

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
          className="flex flex-1 flex-col"
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

export default TaskColumn;
