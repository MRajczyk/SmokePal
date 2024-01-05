"use server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/server/auth";
import { createZodFetcher } from "zod-fetch";
import defaultResponseSchema from "@/schemas/defaultResponseSchema";
import { fetcher } from "@/lib/utils";
import { getToken } from "next-auth/jwt";
import { headers, cookies } from "next/headers";

export async function stopSmokingSessionAction() {
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

  try {
    const fetch = createZodFetcher(fetcher);
    return fetch(
      defaultResponseSchema,
      process.env.NEXT_PUBLIC_BACKEND_URL + "/api/stop",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );
  } catch (e) {
    return { success: false, message: "Could not fetch the data" };
  }
}
