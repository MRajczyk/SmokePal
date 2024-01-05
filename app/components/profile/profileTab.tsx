import { Button } from "../ui/button";
import Link from "next/link";
import HistoryArrow from "@/public/assets/historyArrowSettings.svg";
import React from "react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const ProfileTab = ({ title, href }: { title: string; href: string }) => {
  const pathnameSplit = usePathname().split("/");
  const currentSubpath =
    pathnameSplit[pathnameSplit.length - 1] === "settings"
      ? "username"
      : pathnameSplit[pathnameSplit.length - 1];

  return (
    <Button
      asChild
      variant={"default"}
      className={cn(
        "flex bg-[#1E2122] text-[#F4EDE5] w-[490px] h-[100px] items-center justify-center rounded-xl px-12",
        currentSubpath === title.toLowerCase()
          ? "bg-[#F4EDE5] text-[#1E2122]"
          : ""
      )}
    >
      <Link
        href={href}
        className={cn(
          "flex text-[#F4EDE5] justify-between fill-[#F4EDE5]",
          currentSubpath === title.toLowerCase() ? "fill-[#1E2122]" : ""
        )}
      >
        <span className="text-2xl font-semibold">{title}</span>
        <HistoryArrow
          alt="History icon"
          className="inline-block cursor-pointer"
          width={56}
        />
      </Link>
    </Button>
  );
};

export default ProfileTab;
