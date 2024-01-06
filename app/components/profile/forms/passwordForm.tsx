"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { changePassword } from "@/app/actions/changePassword";
import {
  PasswordChangeSchema,
  type PasswordChangeSchemaType,
} from "@/schemas/UserSchemas";

const ChangeUsernameForm = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    resetField,
  } = useForm<PasswordChangeSchemaType>({
    mode: "all",
    resolver: zodResolver(PasswordChangeSchema),
  });

  const onSubmit = async (data: PasswordChangeSchemaType) => {
    setErrorMessage("");
    setSuccessMessage("");
    const res = await changePassword(data);
    if (res.success) {
      setSuccessMessage(res.message);
      resetField("password");
      resetField("newPassword");
      resetField("confirm");
    } else {
      setErrorMessage(res.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <input
          placeholder="Current password"
          type="password"
          className="w-[490px] h-[100px] p-[38px] rounded-[9px] placeholder:text-[#6C6B6A] bg-[#1E2122] text-[#F4EDE5]"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-red-600">{errors.password.message}</p>
        )}
        <input
          placeholder="New password"
          type="password"
          className="w-[490px] h-[100px] p-[38px] rounded-[9px] placeholder:text-[#6C6B6A] bg-[#1E2122] text-[#F4EDE5]"
          {...register("newPassword")}
        />
        {errors.newPassword && (
          <p className="text-red-600">{errors.newPassword.message}</p>
        )}
        <input
          placeholder="Confirm new password"
          type="password"
          className="w-[490px] h-[100px] p-[38px] rounded-[9px] placeholder:text-[#6C6B6A] bg-[#1E2122] text-[#F4EDE5]"
          {...register("confirm")}
        />
        {errors.confirm && (
          <p className="text-red-600">{errors.confirm.message}</p>
        )}
        <Button
          type="submit"
          variant="gradient"
          size="auth"
          className="rounded-[20px] w-[490px]"
        >
          Change password
        </Button>
      </form>
      <p className="text-red-600">{errorMessage}</p>
      <p className="text-green-600">{successMessage}</p>
    </div>
  );
};

export default ChangeUsernameForm;
