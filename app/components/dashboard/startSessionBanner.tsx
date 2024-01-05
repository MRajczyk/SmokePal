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
        className="flex items-center justify-center w-full h-full rounded-3xl p-8"
        variant="gradient"
      >
        <Link href="/new-session" className="w-full text-left">
          <span className="flex flex-col gap-2 text-4xl mr-2 w-full break-words text-wrap">
            Start new session!
            <p className="text-base font-normal w-full break-wods text-wrap whitespace-normal">
              Start new session with SmokePal. Ignite the fire, set themood, and
              let SmokePal be your guide to a journey of smoky perfection.
            </p>
          </span>
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
