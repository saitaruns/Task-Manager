import React from "react";
import { Clock, Trash } from "lucide-react";
import { cn } from "@/lib/utils";
import { Task } from "./task-column";
import { format, formatDistanceToNowStrict } from "date-fns";
import { Button } from "./ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import instance from "@/lib/request";
import { toast } from "sonner";
import TaskSheet from "./task-sheet";
import ConfirmDialog from "./confirm-dialog";
import { Draggable } from "react-beautiful-dnd";

const TaskCard: React.FC<
  Task & {
    idx: number;
  }
> = ({ idx, ...task }) => {
  const { _id, title, description, status, priority, deadline, updatedAt } =
    task;
  const priorityColors = {
    Low: "bg-[#0ECC5A]",
    Medium: "bg-[#FFA235]",
    Urgent: "bg-[#FF6B6B]",
  };

  return (
    <Draggable key={task._id} draggableId={task._id.toString()} index={idx}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={cn(
            "p-4 relative group rounded-lg border flex flex-col gap-2 bg-[#F9F9F9] border-[##DEDEDE] transition-shadow",
            {
              "shadow-lg": snapshot.isDragging,
            }
          )}
        >
          <DeleteButton id={_id} />
          <div>
            <TaskSheet task={task}>
              <h3 className="text-md text-[#606060] font-[500] break-words hover:underline line-clamp-2">
                {title}
              </h3>
            </TaskSheet>
            <p className="text-[#797979] text-sm line-clamp-3 break-words">
              {description}
            </p>
          </div>
          <div
            className={cn(
              priorityColors[priority],
              "w-fit py-1 px-2 rounded-lg text-xs text-white"
            )}
          >
            {priority}
          </div>
          <div className="flex flex-col gap-3">
            <div className="text-sm mt-2 flex gap-2 items-center text-[#606060]">
              {format(new Date(deadline),
                "dd MMM yyyy"
              )}
            </div>
            <div className="text-xs font-[500] flex gap-1 items-center  text-[#797979]">
              <Clock size={12} className="inline" />
              {formatDistanceToNowStrict(new Date(updatedAt), {
                addSuffix: true,
              })}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

const deleteTask = async (id: string) => {
  return instance.delete(`/tasks/${id}`);
};

const DeleteButton = ({ id }: { id: string }) => {
  const queryClient = useQueryClient();

  let toastId: string | number = "";
  const mutation = useMutation({
    mutationFn: (id: string) => {
      return deleteTask(id);
    },
    onSuccess: () => {
      toast.dismiss(toastId);
      toast.success("Task deleted successfully");
    },
    onMutate: () => {
      toastId = toast.loading("Deleting task...");
      const deletedTask = (queryClient.getQueryData(["tasks"]) as Task[]).find(
        (task: Task) => task._id === id
      );
      queryClient.setQueryData(["tasks"], (tasks: Task[]) => {
        return tasks.filter((task: Task) => task._id !== id);
      });
      return { deletedTask };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(["tasks"], (tasks: Task[]) => {
        return [...tasks, context?.deletedTask].sort(
          (a: Task | undefined, b: Task | undefined) => {
            return (
              new Date(a?.updatedAt ?? new Date()).getTime() -
              new Date(b?.updatedAt ?? new Date()).getTime()
            );
          }
        );
      });
      toast.dismiss(toastId);
      toast.error("Failed to delete task. Please try again later.");
    },
  });

  return (
    <ConfirmDialog confirm={() => mutation.mutate(id)}>
      <Button
        variant="ghost"
        className="absolute p-0 hover:bg-inherit active:text-red-400 bg-[#F9F9F9] top-2 hidden group-hover:inline-flex right-2 text-[#606060] font-[400] text-sm"
        disabled={mutation.isPending}
      >
        <Trash size={20} />
      </Button>
    </ConfirmDialog>
  );
};

export default TaskCard;
