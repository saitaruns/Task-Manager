"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";

interface IFormInput {
  fullName: string;
  email: string;
  password: string;
}

const Signup: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    console.log(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#FFFFFF] from-0% to-[#AFA3FF] to-100%">
      <div className="bg-white border border-[#CECECE] p-6 rounded-lg w-full max-w-sm bg-gradient-to-b from-[#F7F7F7] from-0% to-[#F0F0F0] to-100%">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Welcome to <span className="text-[#4534AC]">Workflo</span>!
        </h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <Input
              type="text"
              id="fullName"
              className={`w-full px-3 py-2 border rounded focus:outline-none border-none shadow-none focus-visible:ring-0 bg-[#EBEBEB] text-[#606060] ${
                errors.fullName ? "border-red-500" : "border-gray-300"
              } focus:border-[#4534AC]`}
              placeholder="Full name"
              {...register("fullName", { required: "Full name is required" })}
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.fullName.message}
              </p>
            )}
          </div>
          <div className="mb-4">
            <Input
              type="email"
              id="email"
              className={`w-full px-3 py-2 border rounded focus:outline-none border-none shadow-none focus-visible:ring-0 bg-[#EBEBEB] text-[#606060] ${
                errors.email ? "border-red-500" : "border-gray-300"
              } focus:border-[#4534AC]`}
              placeholder="Your email"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="mb-6">
            <Input
              type="password"
              id="password"
              className={`w-full px-3 py-2 border rounded focus:outline-none border-none shadow-none focus-visible:ring-0 bg-[#EBEBEB] text-[#606060] ${
                errors.password ? "border-red-500" : "border-gray-300"
              } focus:border-[#4534AC]`}
              placeholder="Password"
              {...register("password", { required: "Password is required" })}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          <Button type="submit" className="w-full" variant="shad">
            Sign up
          </Button>
        </form>
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
