import React from "react";

const NewSessionPage = () => {
  return (
    <div className="flex flex-col w-full h-full">
      <div className="text-4xl p-8">
        <b>Nowe wędzenie</b>
      </div>
      <div className="grid grid-cols-2 w-full h-full">
        <div className="flex bg-yellow-100 border-2 border-red-600 mx-4 mb-4">
          Down Left
        </div>
        <div className="flex bg-green-100 border-2 border-red-600 mx-4 mb-4">
          Down Right
        </div>
      </div>
    </div>
  );
};

export default NewSessionPage;
