import React from "react";

const SessionPill = ({ value }: { value: string }) => {
  return (
    <div className="p-2 px-4 w-fit text-base bg-[#F4EDE5] text-[#15191C] rounded-[30px]">
      {value}
    </div>
  );
};

export default SessionPill;
