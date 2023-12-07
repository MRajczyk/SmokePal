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
  } = useForm<PasswordChangeSchemaType>({
    mode: "onChange",
    resolver: zodResolver(PasswordChangeSchema),
  });

  const onSubmit = async (data: PasswordChangeSchemaType) => {
    //update password on backend vv placeholder so no errors
    const res = await changePassword(data);
    if (res.success) {
      setSuccessMessage(res.message);
    } else {
      setErrorMessage(res.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-[200px] h-[200px] bg-orange-300 rounded-xl">
      <form className="flex flex-col gap-1" onSubmit={handleSubmit(onSubmit)}>
        <input
          placeholder="Current password"
          type="password"
          {...register("password")}
        ></input>
        <p className="text-red-600">{errors.password?.message}</p>
        <input
          placeholder="New password"
          type="password"
          {...register("newPassword")}
        ></input>
        <p className="text-red-600">{errors.newPassword?.message}</p>
        <input
          placeholder="Confirm new password"
          type="password"
          {...register("confirm")}
        ></input>
        <p className="text-red-600">{errors.confirm?.message}</p>
        <Button type="submit">Change password</Button>
      </form>
      <p className="text-red-600">{errorMessage}</p>
      <p className="text-green-600">{successMessage}</p>
    </div>
  );
};

export default ChangeUsernameForm;
