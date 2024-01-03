import React from "react";
import DashboardHeader from "@/components/dashboard/header";
import StartSessionBanner from "@/components/dashboard/startSessionBanner";
import RecentSession from "@/components/dashboard/recentSession";
import WeatherBanner from "@/components/dashboard/weather";

export default function Home() {
  return (
    <div className="flex w-full h-full flex-col">
      <div className="flex w-full p-8 pb-4">
        <DashboardHeader />
      </div>
      <div className="grid grid-cols-5 grid-rows-5 w-full h-full p-8 pt-4">
        <div className="flex col-span-3 row-span-1 w-full pr-4 pb-4">
          <StartSessionBanner />
        </div>
        <div className="flex col-span-2 row-span-5 w-full pl-4">
          <WeatherBanner />
        </div>
        <div className="flex col-span-3 row-span-4 w-full pr-4 pt-4">
          <RecentSession />
        </div>
      </div>
    </div>
  );
}
