"use client";
import React, { ReactNode } from "react";
import { Button } from "./button";
import { useRouter } from "next/navigation";
import { getActiveSessionId } from "@/app/actions/getActiveSessionId";
import { useSearchParams } from "next/navigation";
import { useCallback } from "react";

export function ActiveSessionButton({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  return (
    <Button
      className={className}
      variant="ghost"
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onClick={async (e) => {
        const res = await getActiveSessionId();
        if (res.success && res.data) {
          const sessionId = JSON.parse(res.data).sessionId;
          router.push(
            `/session/${sessionId ?? -1}` +
              "?" +
              createQueryString("fromHistory", "false"),
            { scroll: false }
          );
        } else {
          router.push(`/session/${-1}`, { scroll: false });
        }
      }}
    >
      {children}
    </Button>
  );
}
