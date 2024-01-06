"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { changeUsername } from "@/app/actions/changeUsername";
import { useSession } from "next-auth/react";
import { UsernameSchema, type UsernameSchemaType } from "@/schemas/UserSchemas";

const ChangeUsernameForm = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { data: session, update } = useSession();

  const {
    register,
    handleSubmit,
    resetField,
    formState: { errors },
  } = useForm<UsernameSchemaType>({
    mode: "onChange",
    resolver: zodResolver(UsernameSchema),
  });

  const onSubmit = async (data: UsernameSchemaType) => {
    setSuccessMessage("");
    setErrorMessage("");
    const res = await changeUsername(data);
    if (res.success) {
      await update({ username: data.username });
      setSuccessMessage(res.message);
      resetField("username");
    } else {
      setErrorMessage(res.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <h3 className="text-center text-[#F4EDE5]">Current username:</h3>
        <div className="w-[490px] h-[100px] p-[38px] rounded-[9px] bg-[#1E2122] text-[#F4EDE5] flex items-center justify-center">
          <p className="text-center text-4xl font-semibold">
            {session?.user.username}
          </p>
        </div>
        <input
          placeholder="New username"
          className="w-[490px] h-[100px] p-[38px] rounded-[9px] placeholder:text-[#6C6B6A] bg-[#1E2122] text-[#F4EDE5]"
          {...register("username")}
        />
        <p className="text-red-600">{errors.username?.message}</p>
        <Button
          type="submit"
          variant="gradient"
          size="auth"
          className="rounded-[20px] w-[490px]"
        >
          Change username
        </Button>
      </form>
      <p className="text-red-600">{errorMessage}</p>
      <p className="text-green-600">{successMessage}</p>
    </div>
  );
};

export default ChangeUsernameForm;
