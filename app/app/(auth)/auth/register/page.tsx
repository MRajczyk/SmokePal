"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { registerUser } from "@/app/actions/register";
import Link from "next/link";
import { RegisterSchema, type RegisterSchemaType } from "@/schemas/UserSchemas";
// @ts-expect-error this library doesnt support typescript at all.............
import Logotype from "@/public/assets/logotype.svg?url";
import Image from "next/image";

export default function RegisterPage() {
  const [registerSuccess, setRegisterSuccess] = useState("");
  const [registerError, setRegisterError] = useState("");

  const {
    watch,
    trigger,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchemaType>({
    mode: "all",
    resolver: zodResolver(RegisterSchema),
  });

  const onSubmit = async (data: RegisterSchemaType) => {
    setRegisterError("");
    setRegisterSuccess("");
    const res = await registerUser(data);
    if (res.success === true) {
      setRegisterSuccess("Registered successfully!");
    } else {
      setRegisterError(res.error);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const subscription = watch((_value, { name }) => {
      void trigger(["password", "confirm"]);
    });

    return () => subscription.unsubscribe();
  }, [watch, trigger]);

  return (
    <div className="flex flex-col gap-6 items-center justify-center">
      <h2 className="text-3xl text-[#F4EDE5]">Welcome to</h2>
      <Image src={Logotype} alt="Picture of smoked meat" />
      <p className="text-base text-[#6C6B6A]">Your Own Smoking Companion</p>

      <form
        className="flex flex-col gap-2 mt-2 items-center"
        onSubmit={handleSubmit(onSubmit)}
      >
        <input
          {...register("email")}
          placeholder="email"
          className="w-[470px] h-[90px] p-[38px] rounded-[9px] placeholder:text-[#6C6B6A] bg-[#1E2122] text-[#F4EDE5]"
        />
        <p className="text-red-600">{errors.email?.message}</p>

        <input
          {...register("username")}
          placeholder="username"
          className="w-[470px] h-[90px] p-[38px] rounded-[9px] placeholder:text-[#6C6B6A] bg-[#1E2122] text-[#F4EDE5]"
        />
        <p className="text-red-600">{errors.username?.message}</p>

        <input
          type="password"
          {...register("password")}
          placeholder="password"
          className="w-[470px] h-[90px] p-[38px] rounded-[9px] placeholder:text-[#6C6B6A] bg-[#1E2122] text-[#F4EDE5]"
        />
        <p className="text-red-600">{errors.password?.message}</p>

        <input
          type="password"
          {...register("confirm")}
          placeholder="password"
          className="w-[470px] h-[90px] p-[38px] rounded-[9px] placeholder:text-[#6C6B6A] bg-[#1E2122] text-[#F4EDE5]"
        />
        <p className="text-red-600">{errors.confirm?.message}</p>

        <Button type="submit" variant="gradient" size="auth">
          Create Account
        </Button>
        {registerError && <p className="text-red-600">{registerError}</p>}
        {registerSuccess && <p className="text-green-600">{registerSuccess}</p>}
        <span className="text-[#6C6B6A] mt-4">
          Already a member?
          <Link className="text-[#F4EDE5] ml-2 font-bold" href="/auth/login">
            Log in now!
          </Link>
        </span>
      </form>
    </div>
  );
}
