import React from "react";
import { Button } from "../ui/button";
// @ts-expect-error this library doesnt support typescript at all.............
import StartSessionImg from "@/public/assets/startSessionImg.svg?url";
import Image from "next/image";
import Link from "next/link";

const StartSessionBanner = () => {
  return (
    <div className="flex w-full h-full items-center justify-center bg-transparent">
      <Button
        asChild
        className="flex items-center justify-center w-full h-full rounded-3xl"
        variant="destructive"
      >
        <Link href="/new-session" className="flex">
          <span className="text-4xl mr-2">Start new session!</span>
          <Image
            src={StartSessionImg}
            alt="Add icon"
            className="inline-block cursor-pointer"
            width={90}
            height={90}
          />
        </Link>
      </Button>
    </div>
  );
};

export default StartSessionBanner;
