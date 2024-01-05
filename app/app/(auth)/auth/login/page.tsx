"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LoginSchema, type LoginSchemaType } from "@/schemas/UserSchemas";
// @ts-expect-error this library doesnt support typescript at all.............
import Logotype from "@/public/assets/logotype.svg?url";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [loginError, setLoginError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaType>({ resolver: zodResolver(LoginSchema) });
  const onSubmit = async (data: LoginSchemaType) => {
    const res = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });
    if (res?.ok) {
      setLoginError("");
      router.push("/", { scroll: false });
    } else {
      console.log(res?.error);
      setLoginError("Login attemp failed");
    }
  };

  return (
    <div className="flex flex-col gap-6 items-center justify-center">
      <h2 className="text-3xl text-[#F4EDE5]">Log in to Your</h2>
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
          type="password"
          {...register("password")}
          placeholder="password"
          className="w-[470px] h-[90px] p-[38px] rounded-[9px] placeholder:text-[#6C6B6A] bg-[#1E2122] text-[#F4EDE5]"
        />
        <p className="text-red-600">{errors.password?.message}</p>
        <p className="text-red-600">{loginError}</p>

        <Button type="submit" variant="gradient" size="auth">
          Log in to Your Account
        </Button>
        <span className="text-[#6C6B6A] mt-4">
          Not a member yet?
          <Link className="text-[#F4EDE5] ml-2 font-bold" href="/auth/register">
            Go to register
          </Link>
        </span>
      </form>
    </div>
  );
}
