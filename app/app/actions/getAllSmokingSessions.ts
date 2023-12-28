"use server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/server/auth";

export async function getAllSmokingSessions() {
  const session = await getServerSession(authOptions);
  if (!session) {
    // TODO: maybe redirect to login page?
    return { success: false, message: "Unauthorized" };
  }

  try {
    const smokingSessions = await prisma.smokingSession.findMany();
    return {
      success: true,
      data: JSON.stringify({
        smokingSessions: smokingSessions,
      }),
    };
  } catch (e) {
    return { success: false, message: "Could not fetch the data" };
  }
}
