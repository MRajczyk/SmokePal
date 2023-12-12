"use client";
import React, { ReactNode } from "react";
import { Button } from "./button";
import { useRouter } from "next/navigation";
import { getActiveSessionId } from "@/app/actions/getActiveSessionId";

export function ActiveSessionButton({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const router = useRouter();

  return (
    <Button
      asChild
      className={className}
      variant="ghost"
      size={"logout"}
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onClick={async (e) => {
        const res = await getActiveSessionId();
        if (res.success && res.data) {
          const sessionId = JSON.parse(res.data).sessionId;
          router.push(`/session/${sessionId ?? -1}`, { scroll: false });
        } else {
          router.push(`/session/${-1}`, { scroll: false });
        }
      }}
    >
      {children}
    </Button>
  );
}
