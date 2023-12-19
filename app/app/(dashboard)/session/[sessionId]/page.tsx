"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import useWebSocket, { ReadyState } from "react-use-websocket";
import debounce from "just-debounce-it";
import { SUBMIT_DEBOUNCE_MS } from "@/lib/utils";
import { useMutation } from "react-query";
import { createZodFetcher } from "zod-fetch";
import { fetcher } from "@/lib/utils";
import defaultResponseSchema from "@/schemas/defaultResponseSchema";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Legend } from "recharts";
import moment from "moment";
import { z } from "zod";
import { getHistoricData } from "@/app/actions/getHistoricData";

const sensorReadingSchema = z.object({
  sensorName: z.string(),
  value: z.number(),
  type: z.string(),
  timestamp: z.string().datetime(),
  timestampUnix: z.number(),
});

export type sensorReadingSchemaType = z.infer<typeof sensorReadingSchema>;

export default function SessionPage({
  params,
}: {
  params: { sessionId: number };
}) {
  const socketUrl = "ws://localhost:7071";

  const [tempSensor1Readings, setTempSensor1Readings] = useState<
    sensorReadingSchemaType[]
  >([]);
  const [tempSensor2Readings, setTempSensor2Readings] = useState<
    sensorReadingSchemaType[]
  >([]);
  const [tempSensor3Readings, setTempSensor3Readings] = useState<
    sensorReadingSchemaType[]
  >([]);
  const [humSensor1Readings, setHumSensor1Readings] = useState<
    sensorReadingSchemaType[]
  >([]);

  const [messageHistory, setMessageHistory] = useState([]);
  const { /*sendMessage,*/ lastMessage, readyState } = useWebSocket(socketUrl, {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    shouldReconnect: (closeEvent) => true,
    reconnectAttempts: Infinity,
  });

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  useEffect(() => {
    if (lastMessage !== null) {
      setMessageHistory((prev) => prev.concat(lastMessage.data));
      const msg = JSON.parse(lastMessage.data);
      if (msg.sessionId != params.sessionId) {
        console.log("not added");
        return;
      }
      if (msg.sensorName === "Hum1") {
        setHumSensor1Readings((prev) =>
          prev.concat({
            sensorName: msg.sensorName,
            value: msg.value,
            timestamp: msg.timestamp,
            type: msg.type,
            timestampUnix: moment(msg.timestamp).valueOf(),
          })
        );
      } else if (msg.sensorName === "Temp1") {
        setTempSensor1Readings((prev) =>
          prev.concat({
            sensorName: msg.sensorName,
            value: msg.value,
            timestamp: msg.timestamp,
            type: msg.type,
            timestampUnix: moment(msg.timestamp).valueOf(),
          })
        );
      } else if (msg.sensorName === "Temp2") {
        setTempSensor2Readings((prev) =>
          prev.concat({
            sensorName: msg.sensorName,
            value: msg.value,
            timestamp: msg.timestamp,
            type: msg.type,
            timestampUnix: moment(msg.timestamp).valueOf(),
          })
        );
      } else if (msg.sensorName === "Temp3") {
        setTempSensor3Readings((prev) =>
          prev.concat({
            sensorName: msg.sensorName,
            value: msg.value,
            timestamp: msg.timestamp,
            type: msg.type,
            timestampUnix: moment(msg.timestamp).valueOf(),
          })
        );
      }
    }
  }, [
    lastMessage,
    setMessageHistory,
    setTempSensor1Readings,
    setTempSensor2Readings,
    setTempSensor3Readings,
    setHumSensor1Readings,
  ]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getHistoricData(params.sessionId.toString());
      if (!res.data) {
        console.log("no data available");
        return;
      }
      const historicData = await JSON.parse(res.data);
      const hum1Array: sensorReadingSchemaType[] = [];
      const temp1Array: sensorReadingSchemaType[] = [];
      const temp2Array: sensorReadingSchemaType[] = [];
      const temp3Array: sensorReadingSchemaType[] = [];

      historicData.historicData.forEach(
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
      setHumSensor1Readings((prev) =>
        prev
          .concat(hum1Array)
          .sort((a, b) => (a.timestampUnix > b.timestampUnix ? 1 : -1))
      );
    };

    if (params.sessionId) {
      fetchData().catch(console.error);
    }
  }, []);

  async function startSmokingSession() {
    const fetch = createZodFetcher(fetcher);
    return fetch(
      defaultResponseSchema,
      process.env.NEXT_PUBLIC_BACKEND_URL + "/api/start",
      {
        method: "POST",
        body: JSON.stringify({
          //add error handling for missing session id i guess, or just use !
          sessionId: params.sessionId,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  const {
    mutate: mutateStart,
    isLoading: isLoadingStart,
    isSuccess: isSuccessStart,
  } = useMutation({
    mutationFn: startSmokingSession,
    onError: (error) => {
      if (error instanceof Error) {
        alert(error);
      }
    },
  });

  const debounceStartSmokingSession = debounce(
    () => mutateStart(),
    SUBMIT_DEBOUNCE_MS,
    true
  );

  async function stopSmokingSession() {
    const fetch = createZodFetcher(fetcher);
    return fetch(
      defaultResponseSchema,
      process.env.NEXT_PUBLIC_BACKEND_URL + "/api/stop",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  const {
    mutate: mutateStop,
    isLoading: isLoadingStop,
    isSuccess: isSuccessStop,
  } = useMutation({
    mutationFn: stopSmokingSession,
    onError: (error) => {
      if (error instanceof Error) {
        alert(error);
      }
    },
  });

  const debounceStopSmokingSession = debounce(
    () => mutateStop(),
    SUBMIT_DEBOUNCE_MS,
    true
  );

  const dateFormatter = (date) => {
    // return moment(date).unix();
    return moment(date).format("HH:mm:ss");
  };

  return (
    <div>
      {params.sessionId > 0 ? (
        <div>
          <div>Session id: {params.sessionId}</div>
          <Button
            variant="default"
            onClick={() => {
              debounceStartSmokingSession();
            }}
          >
            Start
          </Button>
          <Button
            variant="default"
            onClick={() => debounceStopSmokingSession()}
          >
            Stop
          </Button>
          <br />
          <p>The WebSocket is currently {connectionStatus}</p>
          <p>Humidity readings over time</p>
          {humSensor1Readings.length > 0 && (
            <LineChart width={600} height={300}>
              <Line
                data={humSensor1Readings}
                type="monotone"
                dataKey="value"
                stroke="black"
                strokeWidth={2}
                dot={false}
              />
              {/* <CartesianGrid stroke="#ccc" /> */}
              <XAxis
                dataKey={"timestampUnix"}
                domain={[
                  humSensor1Readings.at(0)!.timestampUnix,
                  humSensor1Readings.at(humSensor1Readings.length - 1)!
                    .timestampUnix,
                ]}
                type="number"
                tickFormatter={dateFormatter}
                interval="preserveStartEnd"
              />
              <YAxis />
            </LineChart>
          )}
          <p>Temperature readings over time</p>
          {tempSensor1Readings.length > 0 && (
            <LineChart width={600} height={300}>
              <Line
                name="Temperature 1"
                data={tempSensor1Readings}
                type="monotone"
                dataKey="value"
                stroke="red"
                strokeWidth={2}
                dot={false}
              />
              <Line
                name="Temperature 2"
                data={tempSensor2Readings}
                type="monotone"
                dataKey="value"
                stroke="green"
                strokeWidth={2}
                dot={false}
              />
              <Line
                name="Temperature 3"
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
              <Legend />
            </LineChart>
          )}
        </div>
      ) : (
        <div>Invalid session id</div>
      )}
    </div>
  );
}
