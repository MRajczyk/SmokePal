import React from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
// @ts-expect-error this library doesnt support typescript at all.............
import historyArrow from "@/public/assets/historyArrow.svg?url";

const HistoryBanner = () => {
  return (
    <div className="flex w-full h-full items-center justify-center bg-[#15191C] rounded-[20px] p-8">
      <Button
        asChild
        className="flex items-center justify-center w-full h-full"
        variant={"ghost"}
      >
        <Link href="/history" className="flex text-[#F4EDE5]">
          <span className="flex flex-col gap-2 text-4xl mr-2 w-full break-words text-wrap whitespace-normal text-start font-bold">
            Smoking history
            <p className="text-base font-normal w-full break-words text-wrap whitespace-normal">
              Go to history of your smoking sessions and track your flavorful
              journey
            </p>
          </span>
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
