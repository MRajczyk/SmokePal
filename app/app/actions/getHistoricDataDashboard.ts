"use server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/server/auth";
import { Prisma } from "@prisma/client";

export async function getHistoricDataDashboard() {
  const session = await getServerSession(authOptions);
  if (!session) {
    // TODO: maybe redirect to login page?
    return { success: false, message: "Unauthorized" };
  }

  try {
    const sessionData = await prisma.smokingSession.findMany({
      orderBy: {
        id: "desc",
      },
      take: 1,
    });
    if (sessionData.length < 1) {
      return { success: false, message: "Could not fetch historic data" };
    }

    const historicData = await prisma.smokingSensorReading.findMany({
      where: {
        sessionId: sessionData[0].id,
      },
    });

    return {
      success: true,
      data: JSON.stringify({
        historicData: historicData,
        sessionData: sessionData[0],
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
