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
    <div className="flex flex-row items-center">
      <Image
        src={"/assets/weatherIcons/_" + iconCode + ".png"}
        alt={iconCode + " icon from OpenWeatherMap api"}
        width={100}
        height={100}
      />
      <p className="text-3xl">{dayName + " " + reading + "°C"}</p>
    </div>
  );
};

export default WeatherForecastRecord;
