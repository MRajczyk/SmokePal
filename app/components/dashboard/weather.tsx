"use client";
import { ForecastResponse } from "@/schemas/weatherTypes/weatherForecast";
import { CurrentResponse } from "@/schemas/weatherTypes/weatherCurrent";
import React, { useEffect, useState } from "react";
import { Ring } from "react-css-spinners";
import WeatherToday from "./weatherToday";
import WeatherForecast from "./weatherForecast";

const WeatherBanner = () => {
  const OPENWEATHER_CURRENT_URL =
    "http://api.openweathermap.org/data/2.5/weather?q=Lodz&units=metric&appid=";
  const OPENWEATHER_FORECAST_URL =
    "http://api.openweathermap.org/data/2.5/forecast?q=Lodz&units=metric&appid=";

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
      ) : currentWeather && forecast ? (
        <div>
          <WeatherToday
            iconCode={currentWeather?.weather[0].icon}
            city={currentWeather?.name}
            reading={currentWeather?.main.temp}
          />
          <WeatherForecast forecastData={forecast} />
        </div>
      ) : (
        <p>Weather data unavailable</p>
      )}
    </div>
  );
};

export default WeatherBanner;
