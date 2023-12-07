"use server";
import prisma from "@/lib/prisma";
import { hashSync } from "bcrypt";
import { Role } from "@prisma/client";
import { RegisterSchema, type RegisterSchemaType } from "@/schemas/UserSchemas";
import { SALT_ROUNDS } from "@/lib/consts";

export async function registerUser(data: RegisterSchemaType) {
  const parseResult = RegisterSchema.safeParse(data);
  if (!parseResult.success) {
    return { success: false, error: "Could not register user" };
  }

  try {
    await prisma.user.create({
      data: {
        username: parseResult.data.username,
        email: parseResult.data.email,
        password: hashSync(parseResult.data.password, SALT_ROUNDS),
        role: Role.USER,
      },
    });
  } catch (e) {
    return { success: false, error: "Could not register user" };
  }
  return { success: true, error: "User registered" };
}
