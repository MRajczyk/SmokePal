import ProfileMenu from "@/components/profile/profileMenu";
import React from "react";

const SettingsLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col w-full h-full items-center justify-start">
      <div className="text-5xl p-8 text-[#F4EDE5] font-semibold">Settings</div>
      <div className="grid grid-cols-2 w-[1400px] gap-4 h-full mb-[150px]">
        <ProfileMenu className="col-span-1" />
        <div className="flex w-full h-full bg-[#15191C] items-center flex-col justify-center rounded-3xl col-span-1 p-10">
          {children}
        </div>
      </div>
    </div>
  );
};

export default SettingsLayout;
