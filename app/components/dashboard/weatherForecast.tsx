import { ForecastResponse } from "@/schemas/weatherTypes/weatherForecast";
import React, { useMemo } from "react";
import moment from "moment";
import WeatherForecastRecord from "./weatherForecastRecord";

export interface SingleDayForecastEntry {
  dayName: string;
  iconCode: string;
  tempReading: number;
}

const WeatherForecast = ({
  forecastData,
}: {
  forecastData: ForecastResponse;
}) => {
  const fourDaysForecastMiddayReadings = useMemo(() => {
    const tempArrayFourDaysForecastMiddayReadings: SingleDayForecastEntry[] =
      [];

    let prevDay = moment().format("dddd");
    for (let i = 0; i < forecastData.list.length; ++i) {
      const timestampDayName = moment
        .unix(forecastData.list[i].dt)
        .format("dddd");
      const timestampHour = Number.parseInt(
        moment.unix(forecastData.list[i].dt).format("HH")
      );

      if (
        prevDay === timestampDayName ||
        timestampHour < 11 ||
        timestampHour > 13
      ) {
        continue;
      }

      const currentDayCount = tempArrayFourDaysForecastMiddayReadings.push({
        dayName: timestampDayName,
        tempReading: forecastData.list[i].main.temp,
        iconCode: forecastData.list[i].weather[0].icon,
      });

      if (currentDayCount === 4) {
        break;
      }

      prevDay = timestampDayName;
    }

    return tempArrayFourDaysForecastMiddayReadings;
  }, [forecastData]);

  return (
    <div className="flex flex-col gap-2 mt-10">
      {fourDaysForecastMiddayReadings.map(
        ({ dayName, iconCode, tempReading }) => (
          <WeatherForecastRecord
            dayName={dayName}
            iconCode={iconCode}
            reading={tempReading}
          />
        )
      )}
    </div>
  );
};

export default WeatherForecast;
