"use client";
import React from "react";
import ProfileTab from "@/components/profile/profileTab";
import { cn } from "@/lib/utils";

export interface Tab {
  href: string;
  title: string;
}

const settingsTabs: Tab[] = [
  {
    href: "/settings",
    title: "Username",
  },
  {
    href: "/settings/password",
    title: "Password",
  },
  {
    href: "/settings/email",
    title: "Email",
  },
];

const ProfileMenu = ({ className }: { className: string }) => {
  return (
    <div
      className={cn(
        "flex w-full h-full bg-[#15191C] items-center flex-col gap-4 justify-center rounded-[20px]",
        className
      )}
    >
      {settingsTabs.map(({ title, href }) => (
        <ProfileTab title={title} href={href} key={title} />
      ))}
    </div>
  );
};

export default ProfileMenu;
