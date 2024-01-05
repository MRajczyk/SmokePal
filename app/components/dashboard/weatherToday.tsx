import React from "react";
import Image from "next/image";

const WeatherToday = ({
  city,
  reading,
  iconCode,
}: {
  city: string;
  reading: number;
  iconCode: string;
}) => {
  return (
    <div className="w-full h-full text-left">
      <p className="text-3xl font-semibold">Weather</p>
      <p className="text-3xl mt-2">{city}</p>
      <div className="flex flex-row items-center w-full justify-center text-center">
        <Image
          src={"/assets/weatherIcons/_" + iconCode + ".png"}
          alt={iconCode + " icon from OpenWeatherMap api"}
          width={150}
          height={150}
        />
        <p className="text-3xl">{reading + "°C"}</p>
      </div>
    </div>
  );
};

export default WeatherToday;
