"use client";

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
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface SignupFormInput {
  name: string;
  email: string;
  password: string;
}

const formSchema = z.object({
  name: z.string().min(3, {
    message: "Full name must be at least 3 characters.",
  }),
  email: z.string().email({
    message: "Invalid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

const Signup: React.FC = () => {
  const form = useForm<SignupFormInput>({
    resolver: zodResolver(formSchema),
  });

  const [showPassword, setShowPassword] = useState(false);

  const {
    handleSubmit,
    formState: { isValid },
  } = form;

  const router = useRouter();

  const mutation = useMutation({
    mutationFn: (formData: SignupFormInput) => {
      return instance.post("/auth/register", formData);
    },
    onSuccess: (data) => {
      toast.success("Signed up successful");
      router.push("/login");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Invalid email or password");
    },
  });

  const onSubmit: SubmitHandler<SignupFormInput> = (data) => {
    mutation.mutate(data);
  };

  const handleEye = () => setShowPassword(!showPassword);

  return (
    <div className="min-h-screen flex items-center justify-center bg-auth">
      <div className="bg-auth-foreground border-[#CECECE] py-14 px-12 rounded-lg w-full max-w-lg">
        <h1 className="text-4xl font-semibold mb-6 text-center">
          Welcome to <span className="text-[#4534AC]">Workflo</span>!
        </h1>
        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="text"
                      {...field}
                      className="bg-[#EBEBEB] text-[#606060] border-transparent focus:border-[#999999] shadow-none focus-visible:ring-0 p-5"
                      placeholder="Full name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="email"
                      {...field}
                      className="bg-[#EBEBEB] text-[#606060] border-transparent focus:border-[#999999] shadow-none focus-visible:ring-0 p-5"
                      placeholder="Your email"
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
              disabled={!isValid || mutation.isPending || mutation.isSuccess}
              type="submit"
              className="w-full"
              variant="shad"
            >
              Sign up
            </Button>
          </form>
        </Form>
        <p className="text-center text-[#606060] mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-[#4534AC] hover:underline">
            Log in.
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
