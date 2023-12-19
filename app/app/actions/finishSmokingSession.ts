"use server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/server/auth";

export async function finishSmokingSession(sessionId: number) {
  const session = await getServerSession(authOptions);
  if (!session) {
    // TODO: maybe redirect to login page?
    return { success: false, message: "Unauthorized" };
  }

  if (!sessionId || !Number.isNaN(sessionId)) {
    return { success: false, message: "Invalid session id" };
  }

  try {
    await prisma.smokingSession.updateMany({
      where: {
        id: sessionId,
      },
      data: {
        finished: true,
      },
    });

    return {
      success: true,
    };
  } catch (e) {
    return { success: false, message: "Could not end the session" };
  }
}
