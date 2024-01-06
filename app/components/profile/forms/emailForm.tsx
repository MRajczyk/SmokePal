"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { changeEmail } from "@/app/actions/changeEmail";
import { useSession } from "next-auth/react";
import { EmailSchema, type EmailSchemaType } from "@/schemas/UserSchemas";

//TODO: it's temporary, not fully functional - the missing feature is requesting email change from backend -> getting verification email -> performing email change
const ChangeEmailForm = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { data: session, update } = useSession();

  const {
    register,
    handleSubmit,
    resetField,
    formState: { errors },
  } = useForm<EmailSchemaType>({
    mode: "onChange",
    resolver: zodResolver(EmailSchema),
  });

  const onSubmit = async (data: EmailSchemaType) => {
    setSuccessMessage("");
    setErrorMessage("");
    const res = await changeEmail(data);
    if (res.success) {
      await update({ email: data.email });
      setSuccessMessage(res.message);
      resetField("email");
    } else {
      setErrorMessage(res.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <h3 className="text-center text-[#F4EDE5]">Current email:</h3>
        <div className="w-[490px] h-[100px] p-[38px] rounded-[9px] bg-[#1E2122] text-[#F4EDE5] flex items-center justify-center">
          <p className="text-center text-4xl font-semibold">
            {session?.user.email}
          </p>
        </div>
        <input
          placeholder="New email"
          className="w-[490px] h-[100px] p-[38px] rounded-[9px] placeholder:text-[#6C6B6A] bg-[#1E2122] text-[#F4EDE5]"
          {...register("email")}
        />
        <p className="text-red-600">{errors.email?.message}</p>
        <Button
          type="submit"
          variant="gradient"
          size="auth"
          className="rounded-[20px] w-[490px]"
        >
          Change email
        </Button>
      </form>
      <p className="text-red-600">{errorMessage}</p>
      <p className="text-green-600">{successMessage}</p>
    </div>
  );
};

export default ChangeEmailForm;
