"use server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/server/auth";

export async function getActiveSessionId() {
  const session = await getServerSession(authOptions);
  if (!session) {
    // TODO: maybe redirect to login page?
    return { success: false, message: "Unauthorized" };
  }

  try {
    const smokingSession = await prisma.smokingSession.findFirstOrThrow({
      where: {
        finished: false,
      },
    });
    return {
      success: true,
      data: JSON.stringify({
        sessionId: smokingSession.id,
      }),
    };
  } catch (e) {
    return { success: false, message: "Could not fetch session id" };
  }
}
