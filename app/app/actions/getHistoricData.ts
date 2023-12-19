"use server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/server/auth";

export async function getHistoricData(sessionId: number) {
  const session = await getServerSession(authOptions);
  if (!session) {
    // TODO: maybe redirect to login page?
    return { success: false, message: "Unauthorized" };
  }

  if (!sessionId || Number.isNaN(sessionId)) {
    // TODO: maybe redirect to login page?
    return { success: false, message: "Unauthorized" };
  }

  try {
    const historicData = await prisma.smokingSensorReading.findMany({
      where: {
        sessionId: sessionId,
      },
    });
    return {
      success: true,
      data: JSON.stringify({
        historicData: historicData,
      }),
    };
  } catch (e) {
    return { success: false, message: "Could not fetch historic data" };
  }
}
