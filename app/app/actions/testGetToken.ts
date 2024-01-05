"use server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/server/auth";
import { getToken } from "next-auth/jwt";
import { headers, cookies } from "next/headers";
import { decode } from "next-auth/jwt";

export async function testGetToken() {
  const session = await getServerSession(authOptions);
  if (!session) {
    // TODO: maybe redirect to login page?
    return { success: false, message: "Unauthorized" };
  }

  const token = await getToken({
    req: {
      headers: Object.fromEntries(headers()),
      cookies: Object.fromEntries(
        cookies()
          .getAll()
          .map((c) => [c.name, c.value])
      ),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any,
    raw: true,
  });
  console.log("token", token);
  console.log(
    "decoded",
    await decode({ token: token, secret: process.env.NEXTAUTH_SECRET! })
  );

  return { success: true };
}
