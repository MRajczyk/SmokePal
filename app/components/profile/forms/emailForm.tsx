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

  const { register, handleSubmit, resetField } = useForm<EmailSchemaType>({
    mode: "onChange",
    resolver: zodResolver(EmailSchema),
  });

  const onSubmit = async (data: EmailSchemaType) => {
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
    <div className="flex flex-col items-center justify-center w-[200px] h-[200px] bg-orange-300 rounded-xl">
      <form className="flex flex-col gap-1" onSubmit={handleSubmit(onSubmit)}>
        <h3 className="text-center">Current email:</h3>
        <p className="text-center">
          <b>{session?.user.email}</b>
        </p>
        <input placeholder="New email" {...register("email")}></input>
        <Button type="submit">Change email</Button>
      </form>
      <p className="text-red-600">{errorMessage}</p>
      <p className="text-green-600">{successMessage}</p>
    </div>
  );
};

export default ChangeEmailForm;
