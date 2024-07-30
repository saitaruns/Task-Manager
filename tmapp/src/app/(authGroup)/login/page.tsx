"use client";

import { AuthContext } from "@/components/auth-context";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import instance from "@/lib/request";
import { useMutation } from "@tanstack/react-query";
import React, { useContext } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface IFormInput {
  email: string;
  password: string;
}

const formSchema = z.object({
  email: z.string().email({
    message: "Invalid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

const Login: React.FC = () => {
  const form = useForm<IFormInput>({
    resolver: zodResolver(formSchema),
  });

  const router = useRouter();

  const {
    handleSubmit,
    formState: { isValid },
  } = form;

  const { handleSetToken } = useContext(AuthContext);

  const mutation = useMutation({
    mutationFn: (formData: { email: string; password: string }) => {
      return instance.post("/auth/login", formData);
    },
    onSuccess: (data) => {
      toast.success("Login successful");
      handleSetToken(data.data.token);
      router.push("/");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Invalid email or password");
    },
  });

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#FFFFFF] from-0% to-[#AFA3FF] to-100%">
      <div className="bg-gradient-to-b from-[#F7F7F7] from-0% to-[#F0F0F0] to-100% p-6 rounded-lg border border-[#CECECE] w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Welcome to <span className="text-[#4534AC]">Workflo</span>!
        </h1>
        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-3"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Email"
                      {...field}
                      className="bg-[#EBEBEB] text-[#606060] border-none shadow-none focus-visible:ring-0"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Password"
                      type="password"
                      {...field}
                      className="bg-[#EBEBEB] text-[#606060] border-none shadow-none focus-visible:ring-0"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={!isValid || mutation.isPending || mutation.isSuccess}
              variant="shad"
            >
              Login
            </Button>
            <div className="text-sm mx-auto">
              <span className="text-[#606060]">
                Don&apos;t have an account? Create a{" "}
              </span>
              <Link href="/signup" className="text-[#0054A1]">
                new account
              </Link>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Login;
