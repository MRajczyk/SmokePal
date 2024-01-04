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
    <div className="flex flex-row items-center">
      <Image
        src={"/assets/weatherIcons/_" + iconCode + ".png"}
        alt={iconCode + " icon from OpenWeatherMap api"}
        width={120}
        height={120}
      />
      <p className="text-3xl">{city + " " + reading + "°C"}</p>
    </div>
  );
};

export default WeatherToday;
