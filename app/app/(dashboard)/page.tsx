"use client";
import React from "react";

export default function Home() {
  return (
    <div className="flex w-full h-full flex-col">
      <div className="flexw-full p-4 pb-2">
        <div className="flex w-full justify-between bg-green-300">
          <div>Hi, Mikolaj</div>
          <div>Today is 11.09.2001!</div>
        </div>
      </div>
      <div className="grid grid-cols-5 grid-rows-5 w-full h-full p-4 pt-2">
        <div className="flex col-span-3 row-span-1 w-full pr-2 pb-2">
          <div className="w-full bg-slate-300">New smoking session</div>
        </div>
        <div className="flex col-span-2 row-span-5 w-full pl-2">
          <div className="w-full bg-red-300">Weather forecast</div>
        </div>
        <div className="flex col-span-3 row-span-4 w-full pr-2 pt-2">
          <div className="w-full bg-orange-300">Recent smoking session</div>
        </div>
      </div>
    </div>
  );
}
