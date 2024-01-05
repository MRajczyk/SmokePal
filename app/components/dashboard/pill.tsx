import React from "react";

const DashboardPill = ({ value }: { value: string }) => {
  return (
    <div className="p-2 px-4 text-base bg-[#F4EDE5] rounded-[30px]">
      {value}
    </div>
  );
};

export default DashboardPill;
