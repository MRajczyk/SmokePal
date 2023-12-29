"use client";
import React, { ReactNode } from "react";
import { Button } from "./button";
import { signOut } from "next-auth/react";

export function LogoutButton({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <Button
      asChild
      className={className}
      variant="ghost"
      size={"logout"}
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onClick={(e) => {
        signOut();
      }}
    >
      {children}
    </Button>
  );
}
