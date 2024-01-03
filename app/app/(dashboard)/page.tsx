"use client";
import React from "react";

export default function Home() {
  return (
    <div className="grid grid-cols-5 w-full">
      <div className="flex col-span-3 row-span-1 w-full p-4 pr-2 pb-2">
        <div className="w-full bg-slate-300">Zaczynamy wędzić!</div>
      </div>
      <div className="flex col-span-2 row-span-2 w-full p-4 pl-2">
        <div className="w-full bg-red-300">Pogoda</div>
      </div>
      <div className="flex col-span-3 row-span-2 w-full p-4 pr-2 pt-2">
        <div className="w-full bg-orange-300">Twoje ostatnie wędzenie</div>
      </div>
    </div>
  );
}
