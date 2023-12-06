import Link from "next/link";
import React from "react";

const ProfileTab = ({ title, href }: { title: string; href: string }) => {
  return (
    <div className="flex bg-orange-100 w-[90%] h-[80px] items-center justify-center rounded-xl">
      <Link className="text-xl" href={href}>
        {title}
      </Link>
    </div>
  );
};

export default ProfileTab;
