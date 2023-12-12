"use server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/server/auth";

export async function getNewSessionInitialData() {
  const session = await getServerSession(authOptions);
  if (!session) {
    // TODO: maybe redirect to login page?
    return { success: false, message: "Unauthorized" };
  }

  try {
    const woodTypes = await prisma.woodType.findMany();
    const productTypes = await prisma.productType.findMany();
    return {
      success: true,
      data: JSON.stringify({
        woodTypes: woodTypes,
        productTypes: productTypes,
      }),
    };
  } catch (e) {
    return { success: false, message: "Could not fetch the data" };
  }
}
