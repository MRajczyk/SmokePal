"use server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/server/auth";

const UsernameSchema = z.object({
  username: z.string().min(1, "Username is required!"),
});
type UsernameSchemaType = z.infer<typeof UsernameSchema>;

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
    return { success: false, message: "Could not change username" };
  }
  return { success: true, message: "Username changed" };
}
