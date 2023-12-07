"use server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/server/auth";
import {
  PasswordChangeSchema,
  type PasswordChangeSchemaType,
} from "@/schemas/UserSchemas";
import { SALT_ROUNDS } from "@/lib/consts";

export async function changePassword(data: PasswordChangeSchemaType) {
  const session = await getServerSession(authOptions);
  if (!session) {
    // TODO: maybe redirect to login page?
    return { success: false, message: "Unauthorized" };
  }

  const parseResult = PasswordChangeSchema.safeParse(data);
  if (!parseResult.success) {
    return { success: false, message: "Invalid password data" };
  }

  try {
    const userFromSession = session.user;
    const userFromDB = await prisma.user.findUnique({
      where: {
        id: userFromSession.id,
      },
    });

    if (!bcrypt.compareSync(parseResult.data.password, userFromDB!.password)) {
      return { success: false, message: "Could not change password" };
    }

    await prisma.user.update({
      where: {
        id: userFromSession.id,
      },
      data: {
        password: bcrypt.hashSync(parseResult.data.newPassword, SALT_ROUNDS),
      },
    });
  } catch (e) {
    return { success: false, message: "Could not change password" };
  }
  return { success: true, message: "Password changed" };
}
