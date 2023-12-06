import React from "react";
import ProfileTab from "@/components/profile/profileTab";

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

const ProfileMenu = () => {
  return (
    <>
      <div className="flex w-full h-full bg-white items-center flex-col gap-4 justify-start rounded-3xl">
        <h1 className="text-3xl pt-8 pb-6">
          <b>Settings</b>
        </h1>
        {settingsTabs.map(({ title, href }) => (
          <ProfileTab title={title} href={href} />
        ))}
      </div>
    </>
  );
};

export default ProfileMenu;
