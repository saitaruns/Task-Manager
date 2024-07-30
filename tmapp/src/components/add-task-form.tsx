"use client";

import {
  CalendarIcon,
  CirclePlus,
  Delete,
  Loader,
  MessageSquareWarning,
  Pencil,
  Plus,
  Star,
  Trash,
} from "lucide-react";
import { Task, title } from "./task-column";
import { useFieldArray, useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import instance from "@/lib/request";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "./ui/calendar";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const statusOptions = ["todo", "progress", "review", "finished"];
const priorityOptions = ["Low", "Medium", "Urgent"];

const optionsMap: { [key: string]: string[] } = {
  Status: statusOptions,
  Priority: priorityOptions,
};

const iconMap: { [key: string]: React.ReactNode } = {
  Status: <Loader size={16} className="text-muted-foreground" />,
  Priority: (
    <MessageSquareWarning size={16} className="text-muted-foreground" />
  ),
  Deadline: <CalendarIcon size={16} className="text-muted-foreground" />,
  Description: <Pencil size={16} className="text-muted-foreground" />,
};

interface TaskFormProps {
  title: string;
  properties: {
    name: string;
    value: string;
    type: string;
    isDefault: boolean;
  }[];
}

const AddTaskForm = ({
  status,
  task,
}: {
  status?: "todo" | "progress" | "review" | "finished";
  task?: Task;
}) => {
  const form = useForm<TaskFormProps>({
    defaultValues: {
      title: task?.title || "",
      properties: [
        {
          name: "Status",
          value: task?.status || status || "todo",
          type: "select",
          isDefault: true,
        },
        {
          name: "Priority",
          value: task?.priority || "Low",
          type: "select",
          isDefault: true,
        },
        {
          name: "Deadline",
          value: task?.deadline || new Date().toISOString().split("T")[0],
          type: "date",
          isDefault: true,
        },
        {
          name: "Description",
          value: task?.description || "",
          type: "text",
          isDefault: true,
        },
        ...(Object.entries(task?.metadata || {}).map(([key, value]) => ({
          name: key,
          value: value,
          type: "text",
          isDefault: false,
        })) || []),
      ],
    },
  });

  const isUpdate = !!task;

  const { handleSubmit } = form;

  const formatData = (data: TaskFormProps) => {
    const formattedData: { [key: string]: string | Object } = data.properties
      .filter((property) => property.isDefault)
      .reduce(
        (acc, curr) => {
          return {
            ...acc,
            [curr.name.toLowerCase()]: curr.value,
          };
        },
        {
          title: data.title,
        }
      );
    formattedData["metadata"] = data.properties
      .filter((property) => !property.isDefault)
      .reduce((acc, curr) => {
        return {
          ...acc,
          [curr.name]: curr.value,
        };
      }, {});

    return formattedData;
  };

  const postTask = async (data: TaskFormProps) => {
    const formattedData = formatData(data);
    const response = await instance.post("/tasks", formattedData);
    return response.data;
  };

  const patchTask = async (data: TaskFormProps) => {
    const formattedData = formatData(data);
    const response = await instance.patch(`/tasks/${task?._id}`, formattedData);
    return response.data;
  };

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (formData: TaskFormProps) => {
      if (isUpdate) {
        return patchTask(formData);
      }
      return postTask(formData);
    },
    onSuccess: (data: Task) => {
      toast.success("Task created successfully");
      queryClient.setQueryData<Task[]>(["tasks"], (prev) => {
        const newTasks = [...(prev || [])];
        const index = newTasks.findIndex((t) => t._id === task?._id);
        if (index !== -1) {
          newTasks[index] = data;
        } else {
          newTasks.push(data);
        }
        return newTasks;
      });
      const closeSheet = document.querySelector("#close-sheet") as HTMLElement;
      if (closeSheet) {
        closeSheet.click();
      }
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to create task. Please try again later.");
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "properties",
  });

  const onSubmit = (data: TaskFormProps) => {
    mutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
        <FormField
          name="title"
          render={({ field }) => (
            <FormItem className="">
              <FormControl>
                <Input
                  {...field}
                  className="px-0 h-20 text-4xl border-none shadow-none focus-visible:ring-0"
                  placeholder="Title"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {fields.map((field, index) => {
          const isDefault = field.isDefault || false;
          const type = field.type || "text";
          const name = field.name || "New Field";
          return (
            <div key={field.id} className="flex gap-2 [&>*]:flex-1">
              <div className="flex gap-2 items-center">
                {iconMap?.[name] || (
                  <CirclePlus size={16} className="text-muted-foreground" />
                )}
                <FormField
                  name={`properties.${index}.name`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isDefault}
                          className="border-none shadow-none focus-visible:ring-0"
                          placeholder="Name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex gap-2 items-center">
                <FormField
                  name={`properties.${index}.value`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        {type === "text" ? (
                          <Input
                            type="text"
                            {...field}
                            className="border-none shadow-none focus-visible:ring-0"
                            placeholder="Value"
                          />
                        ) : type === "date" ? (
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={(date) => {
                                  field.onChange(date?.toISOString());
                                }}
                                disabled={(date) => date < new Date()}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        ) : (
                          <Select
                            {...field}
                            onValueChange={(value) => {
                              form.setValue(`properties.${index}.value`, value);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select an option" />
                            </SelectTrigger>
                            <SelectContent>
                              {optionsMap?.[name]?.map((option) => {
                                return (
                                  <SelectItem key={option} value={option}>
                                    {title?.[option] || option}
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {!isDefault && (
                  <Trash
                    size={16}
                    className="cursor-pointer"
                    onClick={() => remove(index)}
                  />
                )}
              </div>
            </div>
          );
        })}
        <Button
          onClick={() =>
            append({
              name: "New Field",
              value: "New Value",
              type: "text",
              isDefault: false,
            })
          }
          type="button"
          variant={"ghost"}
          className="justify-start p-0 gap-5 hover:bg-white text-muted-foreground"
        >
          <Plus size={16} />
          Add Custom Property
        </Button>
        <Button
          type="submit"
          disabled={mutation.isPending || mutation.isSuccess}
          variant="shadsecondary"
        >
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default AddTaskForm;
