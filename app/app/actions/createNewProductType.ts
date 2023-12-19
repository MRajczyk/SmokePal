"use server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/server/auth";

export async function createNewProductType(newProductName: string) {
  const session = await getServerSession(authOptions);
  if (!session) {
    // TODO: maybe redirect to login page?
    return { success: false, message: "Unauthorized" };
  }
  try {
    const newSession = await prisma.productType.create({
      data: {
        name: newProductName,
      },
    });
    if (!newSession.id) {
      return { success: false, message: "Could not create new product type" };
    }

    return {
      success: true,
    };
  } catch (e) {
    return { success: false, message: "Could not create new product type" };
  }
}
