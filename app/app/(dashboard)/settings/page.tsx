import ChangeUsernameForm from "@/components/profile/forms/usernameForm";
import ProfileMenu from "@/components/profile/profileMenu";
import React from "react";

const UsernameSettingsPage = () => {
  return (
    <div className="flex justify-center items-center w-full h-full">
      <div className="flex bg-orange-600 w-[800px] h-[600px] justify-center items-center bg-opacity-60 rounded-3xl">
        <div className="grid grid-cols-2 gap-4 w-full h-full p-5">
          <ProfileMenu />
          <div className="flex w-full h-full bg-white items-center flex-col justify-center rounded-3xl">
            <ChangeUsernameForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsernameSettingsPage;
