"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LoginSchema, type LoginSchemaType } from "@/schemas/UserSchemas";

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
    <div>
      <form className="flex flex-col gap-1" onSubmit={handleSubmit(onSubmit)}>
        <input {...register("email")} placeholder="email" />
        <p className="text-red-600">{errors.email?.message}</p>

        <input
          type="password"
          {...register("password")}
          placeholder="password"
        />
        <p className="text-red-600">{errors.password?.message}</p>
        <p className="text-red-600">{loginError}</p>

        <Button type="submit"> Login</Button>
        <Link className="text-blue-700" href="/auth/register">
          Go to register
        </Link>
      </form>
    </div>
  );
}
