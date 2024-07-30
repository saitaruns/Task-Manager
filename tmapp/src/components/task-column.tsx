import React from "react";
import TaskCard from "./task-card";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import TaskSheet from "./task-sheet";
import ThreeLines from "../../public/threelines.svg";
import Image from "next/image";
import { Draggable } from "react-beautiful-dnd";

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
  status: "todo" | "progress" | "review" | "finished";
  tasks?: Task[];
}

export const title: {
  [key: string]: string;
} = {
  todo: "To Do",
  progress: "In Progress",
  review: "Under Review",
  finished: "Finished",
};

const TaskColumn: React.FC<TaskColumnProps> = ({ status, tasks }) => {
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex justify-between mb-3 items-center">
        <h2 className="text-lg font-[400] text-[#555555]">{title[status]}</h2>
        <Image src={ThreeLines} alt="Three lines" width={20} height={20} />
      </div>
      {tasks && tasks.length > 0 && (
        <div className="flex flex-col gap-2 mb-4">
          {tasks?.map((task, idx) => (
            <Draggable
              key={task._id}
              draggableId={task._id.toString()}
              index={idx}
            >
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                >
                  <TaskCard key={task._id} {...task} />
                </div>
              )}
            </Draggable>
          ))}
        </div>
      )}
      <TaskSheet status={status}>
        <Button variant="shadsecondary" className="flex justify-between">
          Add new
          <Plus size={16} className="" />
        </Button>
      </TaskSheet>
    </div>
  );
};

export default TaskColumn;
