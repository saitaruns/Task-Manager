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
import React, { useContext, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader } from "lucide-react";

interface LoginFormInput {
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
  const form = useForm<LoginFormInput>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "admin@workflo.com",
      password: "admin@123",
    },
  });

  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const {
    handleSubmit,
    formState: { isValid },
  } = form;

  const { handleSetToken } = useContext(AuthContext);

  const mutation = useMutation({
    mutationFn: async (formData: { email: string; password: string }) => {
      const response = await instance.post("/auth/login", formData);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Login successful");
      handleSetToken(data.token);
      router.push("/");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Invalid email or password");
    },
  });

  const onSubmit: SubmitHandler<LoginFormInput> = (data) => {
    mutation.mutate(data);
  };

  const handleEye = () => setShowPassword(!showPassword);

  return (
    <div className="min-h-screen flex items-center justify-center bg-auth">
      <div className="flex flex-col gap-7 bg-auth-foreground py-14 px-12 rounded-xl border border-[#CECECE] w-full max-w-lg">
        <h1 className="text-4xl font-semibold text-center">
          Welcome to <span className="text-[#4534AC]">Workflo</span>!
        </h1>
        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
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
                      className="bg-[#EBEBEB] text-[#606060] border-transparent focus:border-[#999999] shadow-none focus-visible:ring-0 p-5"
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
                <FormItem className="bg-[#EBEBEB] rounded-md flex items-center pr-2 border focus-within:border-[#999999]">
                  <FormControl>
                    <>
                      <Input
                        placeholder="Password"
                        type={showPassword ? "text" : "password"}
                        {...field}
                        className="bg-[#EBEBEB] text-[#606060] border-transparent shadow-none focus-visible:ring-0 p-5"
                      />
                      {showPassword ? (
                        <EyeOff
                          strokeWidth={1.5}
                          onClick={handleEye}
                          size={20}
                          className="cursor-pointer text-[#999999]"
                        />
                      ) : (
                        <Eye
                          strokeWidth={1.5}
                          size={20}
                          onClick={handleEye}
                          className="cursor-pointer text-[#999999]"
                        />
                      )}
                    </>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={!isValid || mutation.isPending || mutation.isSuccess}
              variant="shad"
              className="flex items-center gap-2"
            >
              Login
              {(mutation.isPending || mutation.isSuccess) && (
                <Loader size={18} className="animate-spin" />
              )}
            </Button>
          </form>
          <div className="text-sm mx-auto">
            <span className="text-[#606060]">
              Don&apos;t have an account? Create a{" "}
            </span>
            <Link href="/signup" className="text-[#0054A1]">
              new account
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Login;
