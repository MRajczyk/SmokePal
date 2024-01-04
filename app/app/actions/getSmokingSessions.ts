"use server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/server/auth";

export async function getSmokingSessions(page: number, pageItemsCount: number) {
  const session = await getServerSession(authOptions);
  if (!session) {
    // TODO: maybe redirect to login page?
    return { success: false, message: "Unauthorized" };
  }

  try {
    const [count, smokingSessions] = await prisma.$transaction([
      prisma.smokingSession.count(),
      prisma.smokingSession.findMany({
        take: pageItemsCount,
        skip: (page - 1) * pageItemsCount,
        orderBy: {
          id: "desc",
        },
      }),
    ]);
    return {
      success: true,
      data: JSON.stringify({
        smokingSessions: smokingSessions,
        count: count,
      }),
    };
  } catch (e) {
    return { success: false, message: "Could not fetch the data" };
  }
}
