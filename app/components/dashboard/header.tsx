"use client";
import React from "react";
import moment from "moment";
import { useSession } from "next-auth/react";

const DashboardHeader = async () => {
  const { data: session } = useSession();
  return (
    <div className="flex w-full justify-between text-3xl font-medium text-[#F4EDE5]">
      <div>Hello, {session?.user.username}</div>
      <div>Today is {moment().format("ddd, DD.MM.YYYY")}</div>
    </div>
  );
};

export default DashboardHeader;
