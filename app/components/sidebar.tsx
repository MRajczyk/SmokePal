"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { LogoutButton } from "@/components/ui/logoutButton";
import { ActiveSessionButton } from "@/components/ui/activeSessionButton";
import smokepalLogo from "@/public/assets/logo.svg";
import addIcon from "@/public/assets/add_placeholder.svg";
import historyIcon from "@/public/assets/history_placeholder.svg";
import logoutIcon from "@/public/assets/logout_placeholder.svg";
// import recipesIcon from "@/public/assets/recipes_placeholder.svg";
import smokerIcon from "@/public/assets/smoker_placeholder.svg";
import settingsIcon from "@/public/assets/settings_placeholder.svg";
import homeIcon from "@/public/assets/home_placeholder.svg";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const pathname = usePathname().split("/")[1];

  return (
    <div className="bg-orange-600 w-[100px] flex flex-col justify-between items-center h-full sticky top-0">
      <Link href={{ pathname: "/" }}>
        <Image
          src={smokepalLogo}
          alt="SmokePal Logo"
          className="cursor-pointer"
        />
      </Link>
      <div className="flex flex-col justify-center items-center gap-[10px]">
        <Link className="w-12 h-12" href={{ pathname: "/" }}>
          <Image src={homeIcon} alt="Home icon" className="cursor-pointer" />
        </Link>
        <Link className="w-12 h-12" href={{ pathname: "/new-session" }}>
          <Image src={addIcon} alt="Add icon" className="cursor-pointer" />
        </Link>
        <ActiveSessionButton>
          <Image
            src={smokerIcon}
            alt="Active session"
            className="cursor-pointer w-12 h-12"
          />
        </ActiveSessionButton>
        <Link className="w-12 h-12" href={{ pathname: "/history" }}>
          <Image
            src={historyIcon}
            alt="History icon"
            className="cursor-pointer"
          />
        </Link>
        {/*TODO: in the future <Link className="w-12 h-12" href={{ pathname: "/recipes" }}>
                  <Image
                    src={recipesIcon}
                    alt="Recipes icon"
                    className="cursor-pointer"
                  />
                </Link> */}
      </div>
      <div className="flex flex-col justify-center items-center gap-[10px] mb-10">
        <Link className="w-12 h-12" href={{ pathname: "/settings" }}>
          <Image
            src={settingsIcon}
            alt="Settings icon"
            className="cursor-pointer"
          />
        </Link>
        <LogoutButton>
          <Image
            src={logoutIcon}
            alt="Logout icon"
            className="cursor-pointer w-12 h-12"
          />
        </LogoutButton>
      </div>
      <p>Current pathname: {pathname}</p>
    </div>
  );
};

export default Sidebar;
