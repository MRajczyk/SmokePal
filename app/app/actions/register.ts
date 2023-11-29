"use server";
import { PrismaClient } from "@prisma/client";

import { z } from "zod";

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

export async function registerUser(data: RegisterSchemaType) {
  const result = RegisterSchema.safeParse(data);

  if (result.success) {
    return { success: true, error: "User registered" };
  } else {
    return { success: false, error: "Could not register user" };
  }
}
