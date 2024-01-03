import React from "react";
import { Button } from "../ui/button";
import addIcon from "@/public/assets/add_placeholder.svg";
import Image from "next/image";
import Link from "next/link";

const StartSessionBanner = () => {
  return (
    <div className="flex w-full h-full bg-slate-300 items-center justify-center">
      <Button
        asChild
        className="flex items-center justify-center w-[400px] h-[80px]"
      >
        <Link href="/new-session" className="flex">
          <span className="text-4xl mr-2">Start smoking</span>
          <Image
            src={addIcon}
            alt="Add icon"
            className="inline-block cursor-pointer"
            width={40}
          />
        </Link>
      </Button>
    </div>
  );
};

export default StartSessionBanner;
