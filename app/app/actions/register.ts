"use server";
import prisma from "@/lib/prisma";
import { hash } from "bcrypt";
import { Role } from "@prisma/client";

import { z } from "zod";

const RegisterSchema = z
  .object({
    email: z.string().email().min(1, "Email address is required!"),
    username: z.string().min(1, "Username is required!"),
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
  const SALT_ROUNDS = 10;

  const parseResult = RegisterSchema.safeParse(data);
  if (!parseResult.success) {
    return { success: false, error: "Could not register user" };
  }

  try {
    await prisma.user.create({
      data: {
        username: parseResult.data.username,
        email: parseResult.data.email,
        password: await hash(parseResult.data.passwordFirst, SALT_ROUNDS),
        role: Role.USER,
      },
    });
  } catch (e) {
    return { success: false, error: "Could not register user" };
  }
  return { success: true, error: "User registered" };
}
