import React from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
import historyArrow from "@/public/assets/historyArrow.svg?url";

const HistoryBanner = () => {
  return (
    <div className="flex w-full h-full items-center justify-center bg-transparent">
      <Button
        asChild
        className="flex items-center justify-center w-full h-full rounded-3xl"
      >
        <Link href="/history" className="flex">
          <span className="text-4xl mr-2">Go to history</span>
          <Image
            src={historyArrow}
            alt="History icon"
            className="inline-block cursor-pointer"
            width={40}
          />
        </Link>
      </Button>
    </div>
  );
};

export default HistoryBanner;
