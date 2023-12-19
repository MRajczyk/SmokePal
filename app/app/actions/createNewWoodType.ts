"use server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/server/auth";

export async function createNewWoodType(newWoodName: string) {
  const session = await getServerSession(authOptions);
  if (!session) {
    // TODO: maybe redirect to login page?
    return { success: false, message: "Unauthorized" };
  }
  try {
    const newSession = await prisma.woodType.create({
      data: {
        name: newWoodName,
      },
    });
    if (!newSession.id) {
      return { success: false, message: "Could not create new wood type" };
    }

    return {
      success: true,
    };
  } catch (e) {
    return { success: false, message: "Could not create new wood type" };
  }
}
