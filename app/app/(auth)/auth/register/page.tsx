"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { registerUser } from "@/app/actions/register";
import Link from "next/link";
import { RegisterSchema, type RegisterSchemaType } from "@/schemas/UserSchemas";

export default function RegisterPage() {
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
    const res = await registerUser(data);
    if (res.success === true) {
      alert("Registered successfully!");
    } else {
      alert("Could not register user");
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
    <div>
      <form className="flex flex-col gap-1" onSubmit={handleSubmit(onSubmit)}>
        <input {...register("email")} placeholder="email" />
        <p className="text-red-600">{errors.email?.message}</p>

        <input {...register("username")} placeholder="username" />
        <p className="text-red-600">{errors.username?.message}</p>

        <input
          type="password"
          {...register("password")}
          placeholder="password"
        />
        <p className="text-red-600">{errors.password?.message}</p>

        <input
          type="password"
          {...register("confirm")}
          placeholder="password"
        />
        <p className="text-red-600">{errors.confirm?.message}</p>

        <Button type="submit">Register</Button>
        <Link className="text-blue-700" href="/auth/login">
          Go to login
        </Link>
      </form>
    </div>
  );
}
