import React from "react";
import { authOptions } from "@/server/auth";
import { getServerSession } from "next-auth";
import moment from "moment";

const DashboardHeader = async () => {
  const session = await getServerSession(authOptions);
  return (
    <div className="flex w-full justify-between bg-green-200 text-3xl">
      <div>Hi, {session?.user.username}</div>
      <div>Today is {moment().format("ddd, DD.MM.YYYY")}</div>
    </div>
  );
};

export default DashboardHeader;
