"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { LogoutButton } from "@/components/ui/logoutButton";
import { ActiveSessionButton } from "@/components/ui/activeSessionButton";
import SmokepalLogo from "@/public/assets/logoNoLogotype.svg";
import HomeIcon from "@/public/assets/home.svg";
import AddIcon from "@/public/assets/add.svg";
import ActiveIcon from "@/public/assets/active.svg";
import HistoryIcon from "@/public/assets/history.svg";
import LogoutIcon from "@/public/assets/logout.svg";
import SettingsIcon from "@/public/assets/settings.svg";
// import recipesIcon from "@/public/assets/recipes.svg";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const Sidebar = () => {
  const pathname = usePathname().split("/")[1];
  console.log(pathname);

  return (
    <div className="bg-[#15191C] w-[138px] flex flex-col justify-between items-center h-full sticky top-0">
      <Link className="m-6" href={{ pathname: "/" }}>
        <SmokepalLogo
          alt="SmokePal Logo"
          className="cursor-pointer"
          width={90}
        />
      </Link>
      <div className="flex flex-col justify-center items-center gap-[10px]">
        <Link
          className={cn(
            "flex w-20 h-20 items-center justify-center rounded-[40px]",
            pathname === ""
              ? "bg-[#F4EDE5] fill-[#15191C]"
              : "bg-transparent fill-[#F4EDE5]"
          )}
          href={{ pathname: "/" }}
        >
          <HomeIcon
            alt="Home icon"
            className="cursor-pointer"
            width={40}
            height={40}
          />
        </Link>
        <Link
          className={cn(
            "flex w-20 h-20 items-center justify-center rounded-[40px]",
            pathname === "new-session"
              ? "bg-[#F4EDE5] fill-[#15191C]"
              : "bg-transparent fill-[#F4EDE5]"
          )}
          href={{ pathname: "/new-session" }}
        >
          <AddIcon
            alt="Add icon"
            className="cursor-pointer"
            width={40}
            height={40}
          />
        </Link>
        <div
          className={cn(
            "flex w-20 h-20 items-center justify-center rounded-[40px]",
            pathname === "session"
              ? "bg-[#F4EDE5] fill-[#15191C]"
              : "bg-transparent fill-[#F4EDE5]"
          )}
        >
          <ActiveSessionButton>
            <ActiveIcon
              alt="Active session"
              width={40}
              height={43}
              className="cursor-pointer"
            />
          </ActiveSessionButton>
        </div>
        <Link
          className={cn(
            "flex w-20 h-20 items-center justify-center rounded-[40px]",
            pathname === "history"
              ? "bg-[#F4EDE5] fill-[#15191C]"
              : "bg-transparent fill-[#F4EDE5]"
          )}
          href={{ pathname: "/history" }}
        >
          <HistoryIcon
            alt="History icon"
            width={40}
            height={40}
            className="cursor-pointer"
          />
        </Link>
        {/*TODO: in the future <Link className="w-12 h-12" href={{ pathname: "/recipes" }}>
                  <Image
                    src={recipesIcon}
                    alt="Recipes icon"
                    className="cursor-pointer"
                    width={40}
                    height={40}
                  />
                </Link> */}
      </div>
      <div className="flex flex-col justify-center items-center gap-[10px] mb-10">
        <Link
          className={cn(
            "flex w-20 h-20 items-center justify-center rounded-[40px]",
            pathname === "settings"
              ? "bg-[#F4EDE5] fill-[#15191C]"
              : "bg-transparent fill-[#F4EDE5]"
          )}
          href={{ pathname: "settings" }}
        >
          <SettingsIcon
            alt="Settings icon"
            className="cursor-pointer"
            width={40}
            height={43}
          />
        </Link>
        <div className="flex w-20 h-20 items-center justify-center rounded-[40px] fill-[#F4EDE5]">
          <LogoutButton>
            <LogoutIcon
              alt="Logout icon"
              width={40}
              height={40}
              className="cursor-pointer"
            />
          </LogoutButton>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
