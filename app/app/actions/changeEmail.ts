"use server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/server/auth";
import { EmailSchema, type EmailSchemaType } from "@/schemas/UserSchemas";

export async function changeEmail(data: EmailSchemaType) {
  const session = await getServerSession(authOptions);
  if (!session) {
    // TODO: maybe redirect to login page?
    return { success: false, message: "Unauthorized" };
  }

  const parseResult = EmailSchema.safeParse(data);
  if (!parseResult.success) {
    return { success: false, message: "Invalid email data" };
  }

  const user = session.user;

  try {
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        email: parseResult.data.email,
      },
    });
  } catch (e) {
    return { success: false, message: "Could not change email" };
  }
  return { success: true, message: "Email changed" };
}
