"use server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/server/auth";
import { Prisma } from "@prisma/client";

export async function getHistoricData(sessionId: string) {
  const session = await getServerSession(authOptions);
  if (!session) {
    // TODO: maybe redirect to login page?
    return { success: false, message: "Unauthorized" };
  }

  if (!sessionId || Number.isNaN(sessionId)) {
    // TODO: maybe redirect to login page?
    return { success: false, message: "Unauthorized" };
  }
  const sessionIdNumeric = Number.parseInt(sessionId);

  try {
    const sessionData = await prisma.smokingSession.findFirst({
      where: {
        id: sessionIdNumeric,
      },
    });
    const historicData = await prisma.smokingSensorReading.findMany({
      where: {
        sessionId: sessionIdNumeric,
      },
    });

    return {
      success: true,
      data: JSON.stringify({
        historicData: historicData,
        sessionData: sessionData,
      }),
    };
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError ||
      e instanceof Prisma.PrismaClientUnknownRequestError
    )
      console.log(e.message);
    return { success: false, message: "Could not fetch historic data" };
  }
}
