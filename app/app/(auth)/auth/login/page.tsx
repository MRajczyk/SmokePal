"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const LoginSchema = z.object({
  email: z.string().email().min(1, "Email address is required!"),
  password: z
    .string()
    .min(5, "Password needs to be at least 5 characters long!"),
});

type LoginSchemaType = z.infer<typeof LoginSchema>;

export default function LoginPage() {
  const router = useRouter();

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
      router.push("/", { scroll: false });
    } else {
      alert(res?.error ?? "And error occured.");
    }
  };

  return (
    <div>
      <form className="flex flex-col gap-1" onSubmit={handleSubmit(onSubmit)}>
        <input {...register("email")} placeholder="email" />
        <p>{errors.email?.message}</p>

        <input {...register("password")} placeholder="password" />
        <p>{errors.password?.message}</p>

        <Button type="submit"> Login</Button>
      </form>
    </div>
  );
}
