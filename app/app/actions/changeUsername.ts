"use server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/server/auth";
import { UsernameSchema, type UsernameSchemaType } from "@/schemas/UserSchemas";

export async function changeUsername(data: UsernameSchemaType) {
  const session = await getServerSession(authOptions);
  if (!session) {
    // TODO: maybe redirect to login page?
    return { success: false, message: "Unauthorized" };
  }

  const parseResult = UsernameSchema.safeParse(data);
  if (!parseResult.success) {
    return { success: false, message: "Invalid username data" };
  }

  const user = session.user;

  try {
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        username: parseResult.data.username,
      },
    });
  } catch (e) {
    return { success: false, message: "Username is taken" };
  }
  return { success: true, message: "Username changed" };
}
