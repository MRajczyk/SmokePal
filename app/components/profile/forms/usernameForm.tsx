"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { changeUsername } from "@/app/actions/changeUsername";
import { useSession } from "next-auth/react";

const UsernameSchema = z.object({
  username: z.string().min(1, "Username is required!"),
});
type UsernameSchemaType = z.infer<typeof UsernameSchema>;

const ChangeUsernameForm = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { data: session, update } = useSession();

  const { register, handleSubmit, resetField } = useForm<UsernameSchemaType>({
    mode: "onChange",
    resolver: zodResolver(UsernameSchema),
  });

  const onSubmit = async (data: UsernameSchemaType) => {
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
    <div className="flex flex-col items-center justify-center w-[200px] h-[200px] bg-orange-300 rounded-xl">
      <form className="flex flex-col gap-1" onSubmit={handleSubmit(onSubmit)}>
        <h3>Current username:</h3>
        <p className="text-center">
          <b>{session?.user.username}</b>
        </p>
        <input {...register("username")}></input>
        <Button type="submit">Change username</Button>
      </form>
      <p className="text-red-600">{errorMessage}</p>
      <p className="text-green-600">{successMessage}</p>
    </div>
  );
};

export default ChangeUsernameForm;
