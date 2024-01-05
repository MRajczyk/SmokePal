import React from "react";
import Image from "next/image";

const WeatherForecastRecord = ({
  iconCode,
  dayName,
  reading,
}: {
  iconCode: string;
  dayName: string;
  reading: number;
}) => {
  return (
    <div className="flex flex-row w-full items-center justify-between">
      <p className="text-3xl">{dayName}</p>
      <Image
        src={"/assets/weatherIcons/_" + iconCode + ".png"}
        alt={iconCode + " icon from OpenWeatherMap api"}
        width={60}
        height={60}
        className="ml-[80px]"
      />
      <p className="text-3xl">{reading + "°C"}</p>
    </div>
  );
};

export default WeatherForecastRecord;
