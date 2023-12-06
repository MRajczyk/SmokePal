import ProfileMenu from "@/components/profile/profileMenu";
import React from "react";

const PasswordSettingsPage = () => {
  return (
    <div className="flex justify-center items-center w-full h-full">
      <div className="flex bg-orange-600 w-[60%] h-[60%] justify-center items-center bg-opacity-60 rounded-3xl">
        <div className="grid grid-cols-2 gap-4 w-full h-full p-5">
          <ProfileMenu />
          <div className="flex w-full h-full bg-white items-center flex-col justify-start rounded-3xl">
            Password setting form
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordSettingsPage;
