"use client";
import { ForecastResponse } from "@/schemas/weatherTypes/weatherForecast";
import { CurrentResponse } from "@/schemas/weatherTypes/weatherCurrent";
import React, { useEffect, useState } from "react";

const WeatherBanner = () => {
  const OPENWEATHER_CURRENT_URL =
    "http://api.openweathermap.org/data/2.5/weather?q=Myszkow&appid=";
  const OPENWEATHER_FORECAST_URL =
    "http://api.openweathermap.org/data/2.5/forecast?q=Myszkow&appid=";

  const [currentWeather, setCurrentWeather] = useState<
    CurrentResponse | undefined
  >(undefined);

  const [forecast, setForecast] = useState<ForecastResponse | undefined>(
    undefined
  );

  useEffect(() => {
    const fetchData = async () => {
      const currentWeather = await fetch(
        OPENWEATHER_CURRENT_URL + process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY,
        {
          next: { revalidate: 600 },
        }
      );

      const forecastWeather = await fetch(
        OPENWEATHER_FORECAST_URL + process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY,
        {
          next: { revalidate: 600 },
        }
      );

      console.log(await currentWeather.json(), await forecastWeather.json());
    };

    fetchData();
  }, []);
  return (
    <div className="w-full bg-red-300 p-4 flex items-center justify-start flex-col gap-2 ">
      Weather forecast
    </div>
  );
};

export default WeatherBanner;
