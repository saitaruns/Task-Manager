import React from "react";
import { Badge } from "./ui/badge";
import { Clock, Trash } from "lucide-react";
import { cn } from "@/lib/utils";
import { Task } from "./task-column";
import { formatDistanceToNowStrict } from "date-fns";
import { Button } from "./ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import instance from "@/lib/request";
import { toast } from "sonner";
import TaskSheet from "./task-sheet";

const TaskCard: React.FC<Task> = (task) => {
  const { _id, title, description, status, priority, deadline, updatedAt } =
    task;
  const priorityColors = {
    Low: "bg-[#0ECC5A]",
    Medium: "bg-[#FFA235]",
    Urgent: "bg-[#FF6B6B]",
  };

  return (
    <div className="p-4 relative group rounded-lg border flex flex-col gap-2 bg-[#F9F9F9] border-[##DEDEDE]">
      <DeleteButton id={_id} />
      <div>
        <TaskSheet task={task}>
          <h3 className="text-md text-[#606060] font-[500] hover:underline">
            {title}
          </h3>
        </TaskSheet>
        <p className="text-[#797979] text-sm">{description}</p>
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
        <div className="text-sm mt-2 flex gap-2 items-center text-[#606060] font-semibold">
          <Clock size={20} className="inline" />
          {deadline}
        </div>
        <div className="text-sm font-[500] text-[#797979]">
          {formatDistanceToNowStrict(new Date(updatedAt), {
            addSuffix: true,
          })}
        </div>
      </div>
    </div>
  );
};

const deleteTask = async (id: string) => {
  return instance.delete(`/tasks/${id}`);
};

const DeleteButton = ({ id }: { id: string }) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string) => {
      return deleteTask(id);
    },
    onSuccess: () => {
      toast.success("Task deleted successfully");
    },
    onMutate: () => {
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
      toast.error("Failed to delete task. Please try again later.");
    },
  });

  return (
    <Button
      variant="ghost"
      className="absolute top-2 hidden group-hover:inline-flex right-2 text-[#606060] font-[400] text-sm"
      disabled={mutation.isPending}
      onClick={() => mutation.mutate(id)}
    >
      <Trash size={20} />
    </Button>
  );
};

export default TaskCard;
