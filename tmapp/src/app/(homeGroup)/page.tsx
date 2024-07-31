"use client";

import React, { useState } from "react";
import TaskColumn, { Task } from "../../components/task-column";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import MenuBar from "@/components/menubar";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import instance from "@/lib/request";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { toast } from "sonner";
import { Loader } from "@/components/loader";

const fetchTodoList: () => Promise<Task[]> = async () => {
  const response = await instance.get("/tasks");

  return response.data;
};

const Dashboard: React.FC = () => {
  const [query, setQuery] = useState("");
  const { isLoading, data } = useQuery({
    queryKey: ["tasks"],
    queryFn: fetchTodoList,
    placeholderData: keepPreviousData,
    select: (data) =>
      data
        .filter(
          (task) =>
            task.title.toLowerCase().includes(query.toLowerCase()) ||
            task.description.toLowerCase().includes(query.toLowerCase())
        )
        .sort((a, b) => {
          return new Date(a.updatedAt) > new Date(b.updatedAt) ? -1 : 1;
        }),
  });

  let toastId: string | number = "";
  const updateMutation = useMutation({
    mutationFn: (task: Task) => {
      return instance.patch(`/tasks/${task._id}`, task);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.dismiss(toastId);
      toast.success("Task updated successfully.");
    },
    onMutate: (task: Task) => {
      toastId = toast.loading("Updating task...");
      const oldTaskData = queryClient.getQueryData<Task[]>(["tasks"]);
      queryClient.setQueryData<Task[]>(["tasks"], (prev) => {
        const newTasks = [...(prev || [])];
        const index = newTasks.findIndex((t) => t._id === task._id);
        newTasks[index] = task;
        return newTasks;
      });
      return { oldTaskData };
    },
    onError: (_, __, context) => {
      toast.dismiss(toastId);
      toast.error("Failed to update task. Please try again later.");
      queryClient.setQueryData<Task[]>(["tasks"], context?.oldTaskData || []);
    },
  });

  const queryClient = useQueryClient();

  const todoTasks = data?.filter((task) => task.status === "todo") || [];
  const inProgressTasks =
    data?.filter((task) => task.status === "progress") || [];
  const underReviewTasks =
    data?.filter((task) => task.status === "review") || [];
  const finishedTasks =
    data?.filter((task) => task.status === "finished") || [];

  const handleDrag = async (result: any) => {
    if (!result.destination) {
      return;
    }

    const { source, destination, draggableId } = result;

    if (source.droppableId === destination.droppableId) {
      return;
    }

    const updatedTask = {
      ...data?.find((task) => task._id === draggableId),
      status: destination.droppableId,
    } as Task;
    updateMutation.mutate(updatedTask);
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="flex bg-[#F7F7F7] pr-4">
      <Sidebar />
      <div className="flex-grow p-3">
        <Header />
        <MenuBar query={query} setQuery={setQuery} />
        <DragDropContext onDragEnd={handleDrag}>
          <div className="flex mt-3 py-3 px-3 gap-3 bg-white rounded-md">
            <TaskColumn status="todo" tasks={todoTasks} />
            <TaskColumn status="progress" tasks={inProgressTasks} />
            <TaskColumn status="review" tasks={underReviewTasks} />
            <TaskColumn status="finished" tasks={finishedTasks} />
          </div>
        </DragDropContext>
      </div>
    </div>
  );
};

export default Dashboard;
