"use client";

import {
  CalendarIcon,
  CirclePlus,
  Loader,
  MessageSquareWarning,
  Pencil,
  Plus,
  Trash,
} from "lucide-react";
import { Task, title } from "./task-column";
import { useFieldArray, useForm, useFormContext } from "react-hook-form";
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import FileDrop from "./dropzone";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const statusOptions = ["todo", "progress", "review", "finished"];
const priorityOptions = ["Low", "Medium", "Urgent"];

const optionsMap: { [key: string]: string[] } = {
  Status: statusOptions,
  Priority: priorityOptions,
};

const iconMap: { [key: string]: React.ReactNode } = {
  Status: <Loader size={20} />,
  Priority: <MessageSquareWarning size={20} />,
  Deadline: <CalendarIcon size={20} />,
  Description: <Pencil size={20} />,
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

const formSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
  properties: z.array(
    z.object({
      name: z.string().min(3, {
        message: "Name must be at least 3 characters.",
      }),
      value: z.string(),
      type: z.string(),
      isDefault: z.boolean(),
    })
  ),
});

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
    resolver: zodResolver(formSchema),
  });

  const isUpdate = !!task;

  const {
    handleSubmit,
    formState: { errors },
  } = form;

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
      toast.success(`Task ${isUpdate ? "updated" : "created"} successfully!`);
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

  const handleFileDrop = (files: string) => {
    let json = {};
    try {
      json = JSON.parse(files);
    } catch (e) {
      toast.error("Invalid JSON file");
      return;
    }
    console.log(
      "check",
      Object.values(json).every((v) => typeof v === "string")
    );
    if (
      !Array.isArray(json) &&
      !Object.values(json).every((v) => typeof v === "string")
    ) {
      toast.error("Invalid JSON format");
      return;
    }
    Object.entries(json).forEach(([key, value]) => {
      append({
        name: key,
        value: value as string,
        type: "text",
        isDefault: false,
      });
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
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
            <div
              key={field.id}
              className="flex gap-2 items-center [&>*]:flex-1"
            >
              <div className="flex gap-2 items-center">
                <FormField
                  name={`properties.${index}.name`}
                  render={({ field }) => (
                    <FormItem className="flex-1 flex gap-5 items-center text-[#666666]">
                      {iconMap?.[name] || <CirclePlus size={20} />}
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
                                    "w-full pl-3 text-left font-normal border-none shadow-none",
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
                                fromDate={new Date()}
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
          className="justify-start p-0 gap-5 hover:bg-white font-[400]"
        >
          <Plus size={16} />
          <span className="px-3 py-2">Add Custom Property</span>
        </Button>
        <hr className="border-[#E5E5E5] mt-2" />
        <FileDrop onFileDrop={handleFileDrop} />
        <Button
          type="submit"
          disabled={mutation.isPending || mutation.isSuccess}
          variant="shadsecondary"
        >
          {isUpdate ? "Update Task" : "Create Task"}
        </Button>
      </form>
    </Form>
  );
};

export default AddTaskForm;
