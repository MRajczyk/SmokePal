"use client";
import React, { useState, useEffect } from "react";
import { getHistoricDataDashboard } from "@/app/actions/getHistoricDataDashboard";
import { type SmokingSession } from "@prisma/client";
import { sensorReadingSchemaType } from "@/app/(dashboard)/session/[sessionId]/page";
import moment from "moment";
import Link from "next/link";
import { LineChart, Line, XAxis, YAxis } from "recharts";
import { Ring } from "react-css-spinners";

const RecentSession = () => {
  const [fetchingHistoricalDataFailed, setFetchingHistoricalDataFailed] =
    useState<boolean>(false);
  const [fetchingHistoricalData, setFetchingHistoricalData] =
    useState<boolean>(false);
  const [sessionData, setSessionData] = useState<SmokingSession | undefined>(
    undefined
  );
  const [tempSensor1Readings, setTempSensor1Readings] = useState<
    sensorReadingSchemaType[]
  >([]);
  const [tempSensor2Readings, setTempSensor2Readings] = useState<
    sensorReadingSchemaType[]
  >([]);
  const [tempSensor3Readings, setTempSensor3Readings] = useState<
    sensorReadingSchemaType[]
  >([]);

  const fetchHistoricData = async () => {
    setFetchingHistoricalData(true);

    const res = await getHistoricDataDashboard();
    if (!res.data) {
      setFetchingHistoricalDataFailed(true);
      console.log("no data available");
      return;
    }
    const session = await JSON.parse(res.data);
    setSessionData(session.sessionData);
    const historicData = session.historicData;
    const hum1Array: sensorReadingSchemaType[] = [];
    const temp1Array: sensorReadingSchemaType[] = [];
    const temp2Array: sensorReadingSchemaType[] = [];
    const temp3Array: sensorReadingSchemaType[] = [];

    historicData.forEach(
      (reading: {
        sensorName: string;
        value: number;
        timestamp: string;
        type: string;
      }) => {
        if (reading.sensorName === "Hum1") {
          hum1Array.push({
            sensorName: reading.sensorName,
            value: reading.value,
            timestamp: reading.timestamp,
            timestampUnix: moment(reading.timestamp).valueOf(),
            type: reading.type,
          });
        } else if (reading.sensorName === "Temp1") {
          temp1Array.push({
            sensorName: reading.sensorName,
            value: reading.value,
            timestamp: reading.timestamp,
            timestampUnix: moment(reading.timestamp).valueOf(),
            type: reading.type,
          });
        } else if (reading.sensorName === "Temp2") {
          temp2Array.push({
            sensorName: reading.sensorName,
            value: reading.value,
            timestamp: reading.timestamp,
            timestampUnix: moment(reading.timestamp).valueOf(),
            type: reading.type,
          });
        } else if (reading.sensorName === "Temp3") {
          temp3Array.push({
            sensorName: reading.sensorName,
            value: reading.value,
            timestamp: reading.timestamp,
            timestampUnix: moment(reading.timestamp).valueOf(),
            type: reading.type,
          });
        }
      }
    );

    setTempSensor1Readings((prev) =>
      prev
        .concat(temp1Array)
        .sort((a, b) => (a.timestampUnix > b.timestampUnix ? 1 : -1))
    );
    setTempSensor2Readings((prev) =>
      prev
        .concat(temp2Array)
        .sort((a, b) => (a.timestampUnix > b.timestampUnix ? 1 : -1))
    );
    setTempSensor3Readings((prev) =>
      prev
        .concat(temp3Array)
        .sort((a, b) => (a.timestampUnix > b.timestampUnix ? 1 : -1))
    );
    setFetchingHistoricalData(false);
  };

  useEffect(() => {
    fetchHistoricData().catch(console.error);
  }, []);

  const dateFormatter = (date: string | Date) => {
    return moment(date).format("HH:mm:ss");
  };

  return (
    <Link
      href={
        fetchingHistoricalData || fetchingHistoricalDataFailed
          ? "/"
          : `/session/${sessionData?.id ?? -1}?fromHistory=false`
      }
      className="w-full bg-orange-300 flex items-center justify-start flex-col gap-2 overflow-y-auto p-4"
    >
      {fetchingHistoricalData ? (
        <Ring color="white" size={100} />
      ) : (
        <div className="flex flex-col gap-2">
          <p className="self-start text-3xl">Recent smoking session</p>
          <p className="self-start">
            Product(s): {sessionData?.products.join(" ")}
          </p>
          <p className="self-start">Wood(s): {sessionData?.woods.join(" ")}</p>
          <p className="self-start">
            {moment(sessionData?.dateStart).format("ddd, DD.MM.YYYY")}
          </p>
          {tempSensor1Readings.length > 0 && (
            <LineChart width={700} height={400}>
              <Line
                name={sessionData?.tempSensor1Name ?? "Temperature 1"}
                data={tempSensor1Readings}
                type="monotone"
                dataKey="value"
                stroke="red"
                strokeWidth={2}
                dot={false}
              />
              <Line
                name={sessionData?.tempSensor2Name ?? "Temperature 2"}
                data={tempSensor2Readings}
                type="monotone"
                dataKey="value"
                stroke="green"
                strokeWidth={2}
                dot={false}
              />
              <Line
                name={sessionData?.tempSensor3Name ?? "Temperature 3"}
                data={tempSensor3Readings}
                type="monotone"
                dataKey="value"
                stroke="blue"
                strokeWidth={2}
                dot={false}
              />
              {/* <CartesianGrid stroke="#ccc" /> */}
              <XAxis
                dataKey={"timestampUnix"}
                domain={[
                  tempSensor1Readings.at(0)!.timestampUnix,
                  tempSensor1Readings.at(tempSensor1Readings.length - 1)!
                    .timestampUnix,
                ]}
                type="number"
                tickFormatter={dateFormatter}
                interval="preserveStartEnd"
              />
              <YAxis />
            </LineChart>
          )}
        </div>
      )}
    </Link>
  );
};

export default RecentSession;
