"use server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/server/auth";
import { getToken } from "next-auth/jwt";
import { headers, cookies } from "next/headers";

export async function startSmokingSessionAction(sessionId: string) {
  const session = await getServerSession(authOptions);
  if (!session) {
    // TODO: maybe redirect to login page?
    return { success: false, data: "Unauthorized" };
  }

  try {
    const sessionInstance = await prisma.smokingSession.findFirst({
      where: {
        id: Number.parseInt(sessionId),
      },
    });

    if (!sessionInstance) {
      return { success: false, data: "Invalid session Id" };
    }

    const userFromSession = session.user;
    if (sessionInstance.authorId !== userFromSession.id) {
      return { success: false, data: "Unauthorized" };
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    return { success: false, data: e.message };
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

  try {
    const res = await fetch(
      process.env.NEXT_PUBLIC_BACKEND_URL + "/api/start",
      {
        method: "POST",
        body: JSON.stringify({
          //add error handling for missing session id i guess, or just use !
          sessionId: sessionId,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );
    return await res.json();
  } catch (e) {
    return { success: false, data: "Could not start live monitoring" };
  }
}
