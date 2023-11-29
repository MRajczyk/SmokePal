"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const RegisterSchema = z
  .object({
    email: z.string().email().min(1, "Email address is required!"),
    passwordFirst: z
      .string()
      .min(5, "Password needs to be at least 5 characters long!"),
    passwordSecond: z
      .string()
      .min(5, "Password needs to be at least 5 characters long!"),
  })
  .refine((data) => data.passwordFirst === data.passwordSecond, {
    message: "Passwords don't match",
    path: ["passwordFirst"], // path of error
  })
  .refine((data) => data.passwordFirst === data.passwordSecond, {
    message: "Passwords don't match",
    path: ["passwordSecond"], // path of error
  });

type RegisterSchemaType = z.infer<typeof RegisterSchema>;

export default function LoginPage() {
  const router = useRouter();

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
  //todo: fire server action for register form
  const onSubmit = async (data: RegisterSchemaType) => {
    console.log(data);
  };

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const subscription = watch((_value, { name }) => {
      void trigger(["passwordFirst", "passwordSecond"]);
    });

    // Cleanup the subscription on unmount.
    return () => subscription.unsubscribe();
  }, [watch, trigger]);

  return (
    <div>
      <form className="flex flex-col gap-1" onSubmit={handleSubmit(onSubmit)}>
        <input {...register("email")} placeholder="email" />
        <p>{errors.email?.message}</p>

        <input
          type="password"
          {...register("passwordFirst")}
          placeholder="password"
        />
        <p className="text-red-600">{errors.passwordFirst?.message}</p>

        <input
          type="password"
          {...register("passwordSecond")}
          placeholder="password"
        />
        <p className="text-red-600">{errors.passwordSecond?.message}</p>

        <Button type="submit"> Login</Button>
      </form>
    </div>
  );
}
