"use client";
import { ForecastResponse } from "@/schemas/weatherTypes/weatherForecast";
import { CurrentResponse } from "@/schemas/weatherTypes/weatherCurrent";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Ring } from "react-css-spinners";

const WeatherBanner = () => {
  const OPENWEATHER_CURRENT_URL =
    "http://api.openweathermap.org/data/2.5/weather?q=Myszkow&units=metric&appid=";
  const OPENWEATHER_FORECAST_URL =
    "http://api.openweathermap.org/data/2.5/forecast?q=Myszkow&units=metric&appid=";

  const [fetchingData, setFetchingData] = useState<boolean>(false);
  const [errorFetching, setErrorFetching] = useState<boolean>(false);
  const [currentWeather, setCurrentWeather] = useState<
    CurrentResponse | undefined
  >(undefined);

  const [forecast, setForecast] = useState<ForecastResponse | undefined>(
    undefined
  );

  useEffect(() => {
    const fetchData = async () => {
      setFetchingData(true);
      fetch(
        OPENWEATHER_CURRENT_URL + process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY,
        {
          next: { revalidate: 600 },
        }
      )
        .then((res) => res.json())
        .then((currentWeather) => setCurrentWeather(currentWeather))
        .catch((e) => {
          setErrorFetching(true);
          console.log(e.message);
        });

      fetch(
        OPENWEATHER_FORECAST_URL + process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY,
        {
          next: { revalidate: 600 },
        }
      )
        .then((res) => res.json())
        .then((forecastWeather) => {
          setForecast(forecastWeather);
        })
        .catch((e) => {
          setErrorFetching(true);
          console.log(e.message);
        })
        .finally(() => {
          setFetchingData(false);
        });
    };

    fetchData();
  }, []);
  return (
    <div className="w-full bg-red-300 p-4 flex items-center justify-start flex-col gap-2 ">
      {fetchingData ? (
        <div className="w-full h-full flex justify-center items-center">
          <Ring color="orange" size={100} />
        </div>
      ) : errorFetching ? (
        <p>Error fetching weather data...</p>
      ) : (
        <div className="flex flex-row items-center">
          <p className="text-2xl">
            {currentWeather?.name + " " + currentWeather?.main.temp + "°C"}
          </p>
          <Image
            src={
              "/assets/weatherIcons/_" +
              currentWeather?.weather[0].icon +
              ".png"
            }
            alt={
              currentWeather?.weather[0].icon + " icon from OpenWeatherMap api"
            }
            width={100}
            height={100}
          />
        </div>
      )}
    </div>
  );
};

export default WeatherBanner;
