/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import useWebSocket, { ReadyState } from "react-use-websocket";
import debounce from "just-debounce-it";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SUBMIT_DEBOUNCE_MS } from "@/lib/utils";
import { createZodFetcher } from "zod-fetch";
import { fetcher } from "@/lib/utils";
import defaultResponseSchema from "@/schemas/defaultResponseSchema";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Legend } from "recharts";
import moment from "moment";
import { z } from "zod";
import { getHistoricData } from "@/app/actions/getHistoricData";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { SmokingSessionPhoto, type SmokingSession } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import ImageCarousel from "@/components/ui/imageCarousel";
import { Lightbox } from "react-modal-image";
import {
  UpdateSmokingSchema,
  UpdateSmokingSchemaForm,
  UpdateSmokingSchemaFormType,
} from "@/schemas/UpdateSmokingSchema";
import {
  type SelectOptionsSchemaType,
  type SessionSelectSchemaType,
} from "@/schemas/NewSessionSchemas";
import {
  ACCEPTED_IMAGE_TYPES,
  type fileUploadSchemaType,
} from "@/schemas/NewSessionSchemas";
import { getNewSessionInitialData } from "@/app/actions/getNewSessionInit";

import { createNewWoodType } from "@/app/actions/createNewWoodType";
import { createNewProductType } from "@/app/actions/createNewProductType";
import CreatableSelect from "react-select/creatable";
import { Ring } from "react-css-spinners";
import { updateSmokingSession } from "@/app/actions/updateSmokingSession";
import { startSmokingSessionAction } from "@/app/actions/startSmokingSessionAction";
import { stopSmokingSessionAction } from "@/app/actions/stopSmokingSessionAction";
import { StylesConfig } from "react-select";
import SessionPill from "@/components/session/sessionPill";
import { useSession } from "next-auth/react";

//buffer is of type buffer but theres typing error as i cant get data property to be recognized by ts
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function arrayBufferToBase64(buffer: any, mime: string) {
  let binary = "";
  const bytes = buffer.data;
  bytes.forEach((b: number) => (binary += String.fromCharCode(b)));
  const res = `data:${mime};base64,` + btoa(binary);

  return res;
}

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
  const session = useSession();
  const [liveDataStarted, setLiveDataStarted] = useState<boolean>(false);
  const [fetchingHistoricalData, setFetchingHistoricalData] =
    useState<boolean>(false);
  const [editing, setEditing] = useState<boolean>(false);

  const socketUrl = "ws://" + process.env.NEXT_PUBLIC_HOST_IP + ":7071";
  const [sessionFinished, setSessionFinished] = useState(undefined);
  const [sessionData, setSessionData] = useState<SmokingSession | undefined>(
    undefined
  );

  const createOption = (label: string) => ({
    label,
    value: label.toLowerCase().replace(/\W/g, ""),
  });

  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [optionsProducts, setOptionsProducts] = useState<
    SelectOptionsSchemaType[]
  >([]);
  const [isLoadingWood, setIsLoadingWood] = useState(false);
  const [optionsWood, setOptionsWood] = useState<SelectOptionsSchemaType[]>([]);

  function handleAddImage(file: File) {
    if (file.size > 5000000) {
      //TODO: display error maybe
      console.log("File is too big!");
      return;
    }

    if (!ACCEPTED_IMAGE_TYPES.find((type) => type === file.type)) {
      //TODO: display error maybe
      console.log("Unsupported file type");
      return;
    }

    setImages((prevState) => [
      ...prevState,
      {
        temporaryID: uuidv4(),
        file: file,
        b64String: URL.createObjectURL(file),
      },
    ]);
  }

  useEffect(() => {
    const fetchData = async () => {
      const res = await getNewSessionInitialData();

      if (res.success === true) {
        const data: {
          woodTypes: SessionSelectSchemaType[];
          productTypes: SessionSelectSchemaType[];
        } = JSON.parse(res.data ?? "");

        const productTypes: SelectOptionsSchemaType[] = [];
        data.productTypes.forEach((productType: SessionSelectSchemaType) => {
          productTypes.push(createOption(productType.name));
        });
        setOptionsProducts(productTypes);

        const woodTypes: SelectOptionsSchemaType[] = [];
        data.woodTypes.forEach((woodType: SessionSelectSchemaType) => {
          woodTypes.push(createOption(woodType.name));
        });
        setOptionsWood(woodTypes);
      }
    };

    fetchData().catch(console.error);
  }, []);

  function handleRemoveImage(imageUUID: string) {
    const dbIdToBeDeleted = images.find(
      (img) => img.temporaryID === imageUUID
    )?.dbId;
    if (dbIdToBeDeleted) {
      setImagesIdToBeDeleted([...imagesIdToBeDeleted, dbIdToBeDeleted]);
    }
    setImages(images.filter((image) => image.temporaryID !== imageUUID));
  }

  function handleImageClick(imageUUID: string) {
    setModalImageURL(
      images.find((img) => img.temporaryID === imageUUID)!.b64String
    );
    setImageModalOpen(true);
  }

  const [images, setImages] = useState<fileUploadSchemaType[]>([]);
  const [imagesIdToBeDeleted, setImagesIdToBeDeleted] = useState<number[]>([]);
  const [imageModalOpen, setImageModalOpen] = useState<boolean>(false);
  const [modalImageURL, setModalImageURL] = useState<string>("");

  const closeLightbox = () => {
    setImageModalOpen(false);
  };

  const searchParams = useSearchParams();
  const fromHistory = searchParams.get("fromHistory");

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
  }, [lastMessage]);

  const fetchHistoricData = async () => {
    setFetchingHistoricalData(true);
    const res = await getHistoricData(params.sessionId.toString());
    if (!res.data) {
      console.log("no data available");
      return;
    }
    const session = await JSON.parse(res.data);
    const tempArrayForImages: fileUploadSchemaType[] = [];
    session.sessionPhotos.forEach((imagesEntry: SmokingSessionPhoto) => {
      tempArrayForImages.push({
        temporaryID: uuidv4(),
        b64String: arrayBufferToBase64(imagesEntry.data, imagesEntry.mime),
        dbId: imagesEntry.id,
      });
    });
    setImages(tempArrayForImages);
    setSessionFinished(session.sessionData.finished);
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
    setHumSensor1Readings((prev) =>
      prev
        .concat(hum1Array)
        .sort((a, b) => (a.timestampUnix > b.timestampUnix ? 1 : -1))
    );
    setFetchingHistoricalData(false);
  };

  useEffect(() => {
    if (params.sessionId) {
      fetchHistoricData().catch(console.error);
    }
  }, []);

  useEffect(() => {
    if (params.sessionId) {
      getBackendStatus();
    }
  }, []);

  function getBackendStatus() {
    const fetch = createZodFetcher(fetcher);
    fetch(
      defaultResponseSchema,
      process.env.NEXT_PUBLIC_BACKEND_URL + "/api/status",
      {
        method: "GET",
      }
    )
      .then((res) => {
        if (res.message === "active") {
          setLiveDataStarted(true);
        } else {
          setLiveDataStarted(false);
        }
      })
      .catch((err) => {
        setLiveDataStarted(false);
      });
  }

  async function startSmokingSession() {
    const res = await startSmokingSessionAction(params.sessionId.toString());
    if (res.success) {
      setLiveDataStarted(true);
    } else {
      console.log(res.message);
    }
  }

  const debounceStartSmokingSession = debounce(
    () => startSmokingSession(),
    SUBMIT_DEBOUNCE_MS,
    true
  );

  async function stopSmokingSession() {
    const res = await stopSmokingSessionAction(params.sessionId.toString());
    if (res.success) {
      setLiveDataStarted(false);
    } else {
      console.log(res.message);
    }
  }

  const debounceStopSmokingSession = debounce(
    () => stopSmokingSession(),
    SUBMIT_DEBOUNCE_MS,
    true
  );

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
  } = useForm<UpdateSmokingSchemaFormType>({
    mode: "all",
    resolver: zodResolver(UpdateSmokingSchemaForm),
  });

  const handleUpdateFormSubmission = async (
    data: UpdateSmokingSchemaFormType
  ) => {
    if (!sessionData || !sessionData.id || sessionData.finished === undefined) {
      alert("Could not update session, fields are empty");
      return;
    }

    const formData = new FormData();
    for (let i = 0; i < images.length; ++i) {
      if (!images[i].file) {
        continue;
      }
      formData.append("files[]", images[i].file!);
    }
    const res = await updateSmokingSession(
      {
        ...data,
        id: sessionData.id,
        finished: sessionData.finished,
      },
      formData,
      imagesIdToBeDeleted
    );
    if (res.success === true) {
      setEditing(false);
      setImagesIdToBeDeleted([]);
      fetchHistoricData();
    } else {
      alert(res.message);
    }
  };

  const debounceUpdateSmokingSession = debounce(
    (data: UpdateSmokingSchemaFormType) => handleUpdateFormSubmission(data),
    SUBMIT_DEBOUNCE_MS,
    true
  );

  const dateFormatter = (date: string | Date) => {
    return moment(date).format("HH:mm:ss");
  };

  const handleCreateProducts = async (inputValue: string) => {
    setIsLoadingProducts(true);
    const res = await createNewProductType(inputValue);
    if (res.success) {
      const newOption = createOption(inputValue);
      setOptionsProducts((prev) => [...prev, newOption]);
      const selectedProducts: SelectOptionsSchemaType[] =
        getValues("products") ?? [];
      selectedProducts.push(newOption);
      setValue("products", selectedProducts);
    }
    setIsLoadingProducts(false);
  };

  const handleCreateWood = async (inputValue: string) => {
    setIsLoadingWood(true);
    const res = await createNewWoodType(inputValue);
    if (res.success) {
      const newOption = createOption(inputValue);
      setOptionsWood((prev) => [...prev, newOption]);
      const selectedWoods: SelectOptionsSchemaType[] = getValues("woods") ?? [];
      selectedWoods.push(newOption);
      setValue("woods", selectedWoods);
    }
    setIsLoadingWood(false);
  };

  function enableEditingMode() {
    setValue("title", sessionData?.title ?? "");

    if (sessionData?.products) {
      const selectedProducts: SelectOptionsSchemaType[] = [];
      sessionData.products.forEach((product) => {
        selectedProducts.push(createOption(product));
      });
      setValue("products", selectedProducts);
    } else {
      setValue("products", []);
    }

    if (sessionData?.woods) {
      const selectedWoods: SelectOptionsSchemaType[] = [];
      sessionData.woods.forEach((wood) => {
        selectedWoods.push(createOption(wood));
      });
      setValue("woods", selectedWoods);
    } else {
      setValue("woods", []);
    }

    setValue("description", sessionData?.description ?? "");
    setValue("tempSensor1Name", sessionData?.tempSensor1Name ?? "");
    setValue("tempSensor2Name", sessionData?.tempSensor2Name ?? "");
    setValue("tempSensor3Name", sessionData?.tempSensor3Name ?? "");

    setEditing(true);
  }

  function handleReject() {}

  const colourStyles: StylesConfig = {
    control: (styles) => ({
      ...styles,
      backgroundColor: "#1E2122",
      borderWidth: 0,
      minHeight: 90,
      color: "#6C6B6A",
      boxShadow: "none",
      borderRadius: 20,
    }),
    option: (styles, { isFocused, isSelected }) => ({
      ...styles,
      color: "#F4EDE6",
      backgroundColor: isFocused
        ? "#6C6B6A"
        : isSelected
        ? "#6C6B6A"
        : "#1E2122",
    }),
    input: (styles) => ({ ...styles, color: "#F4EDE5" }),
    placeholder: (styles) => ({ ...styles, textAlign: "start" }),
    singleValue: (styles) => ({ ...styles }),
    multiValue: (styles) => ({
      ...styles,
      height: 40,
      borderRadius: 20,
      padding: 8,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#F4EDE5",
    }),
    indicatorSeparator: (styles) => ({ ...styles, backgroundColor: "#6C6B6A" }),
    menuList: (styles) => ({ ...styles, backgroundColor: "#1E2122" }),
    multiValueRemove: (styles) => ({
      ...styles,
      height: 22,
      width: 22,
      borderRadius: 11,
    }),
    valueContainer: (styles) => ({ ...styles, padding: 28 }),
    container: (styles) => ({ ...styles, width: "100%" }),
  };

  return (
    <div className="flex w-full h-full flex-col items-center justify-start">
      {imageModalOpen && (
        <Lightbox
          medium={modalImageURL}
          large={modalImageURL}
          alt="Enlarged smoking session image"
          onClose={closeLightbox}
        />
      )}
      {params.sessionId > 0 ? (
        fetchingHistoricalData ? (
          <div className="flex w-full h-full flex-col items-center justify-center">
            <Ring color="orange" size={100} />
          </div>
        ) : (
          <div className="flex w-full h-full flex-col items-center justify-start">
            {editing ? (
              <div className="flex flex-col w-[1400px] justify-center items-center p-8 text-5xl">
                <form
                  key={2}
                  onSubmit={handleSubmit(debounceUpdateSmokingSession)}
                  className="w-full h-full flex justify-center items-center flex-col"
                >
                  <input
                    {...register("title")}
                    placeholder="Title"
                    className="inline-block h-[90px] p-[28px] rounded-[20px] placeholder:text-[#6C6B6A] bg-[#15191C] text-[#F4EDE5] text-center"
                  />
                  <p className="text-red-600 text-2xl">
                    {errors.title?.message}
                  </p>
                </form>
              </div>
            ) : (
              <div className="text-5xl p-8 text-[#F4EDE5] font-semibold">
                <p>{sessionData?.title}</p>
              </div>
            )}
            <div className="grid grid-cols-2 w-[1400px] gap-4 h-full pb-[50px]">
              <div className="flex w-full h-full gap-3 bg-[#15191C] items-center flex-col justify-start rounded-3xl col-span-1 p-10">
                {editing ? (
                  <div className="flex flex-col gap-1 w-full">
                    <form
                      key={0}
                      className="flex flex-col gap-3 w-full"
                      onSubmit={handleSubmit(debounceUpdateSmokingSession)}
                    >
                      <div>
                        <span className="flex flex-row gap-2 justify-start items-center text-[#F4EDE5] mb-3">
                          <div className="bg-[#D1271C] w-[22px] h-[22px] rounded-[11px] ml-3 inline-block"></div>
                          <p className="inline-block">Red sensor</p>
                        </span>
                        <input
                          {...register("tempSensor1Name")}
                          placeholder="Red sensor name"
                          className="w-full h-[90px] p-[28px] rounded-[20px] placeholder:text-[#6C6B6A] bg-[#1E2122] text-[#F4EDE5]"
                        />
                        <p className="text-red-600">
                          {errors.tempSensor1Name?.message}
                        </p>
                      </div>

                      <div>
                        <span className="flex flex-row gap-2 justify-start items-center text-[#F4EDE5] mb-3">
                          <div className="bg-[#F4981D] w-[22px] h-[22px] rounded-[11px] ml-3 inline-block"></div>
                          <p className="inline-block">Yellow sensor</p>
                        </span>
                        <input
                          {...register("tempSensor2Name")}
                          placeholder="Yellow sensor name"
                          className="w-full h-[90px] p-[28px] rounded-[20px] placeholder:text-[#6C6B6A] bg-[#1E2122] text-[#F4EDE5]"
                        />
                        <p className="text-red-600">
                          {errors.tempSensor2Name?.message}
                        </p>
                      </div>

                      <div>
                        <span className="flex flex-row gap-2 justify-start items-center text-[#F4EDE5] mb-3">
                          <div className="bg-[#211ECC] w-[22px] h-[22px] rounded-[11px] ml-3 inline-block"></div>
                          <p className="inline-block">Blue sensor</p>
                        </span>
                        <input
                          {...register("tempSensor3Name")}
                          placeholder="Blue sensor name"
                          className="w-full h-[90px] p-[28px] rounded-[20px] placeholder:text-[#6C6B6A] bg-[#1E2122] text-[#F4EDE5]"
                        />
                        <p className="text-red-600">
                          {errors.tempSensor3Name?.message}
                        </p>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div className="flex w-full h-full gap-3 items-center flex-col justify-start">
                    <div className="flex w-full items-center justify-start flex-col gap-2">
                      <span className="flex flex-row w-full gap-2 justify-start items-start text-[#F4EDE5]">
                        <div className="bg-[#D1271C] w-[22px] h-[22px] rounded-[11px] ml-3 inline-block"></div>
                        <p className="inline-block">
                          Current temperature:{" "}
                          <span className="font-semibold">
                            {
                              tempSensor1Readings.at(
                                tempSensor1Readings.length - 1
                              )?.value
                            }
                          </span>{" "}
                          °C
                        </p>
                      </span>
                      <span className="flex flex-row w-full gap-2 justify-start items-start text-[#F4EDE5]">
                        <div className="bg-[#F4981D] w-[22px] h-[22px] rounded-[11px] ml-3 inline-block"></div>
                        <p className="inline-block">
                          Current temperature:{" "}
                          <span className="font-semibold">
                            {
                              tempSensor2Readings.at(
                                tempSensor2Readings.length - 1
                              )?.value
                            }
                          </span>{" "}
                          °C
                        </p>
                      </span>
                      <span className="flex flex-row w-full gap-2 justify-start items-start text-[#F4EDE5]">
                        <div className="bg-[#211ECC] w-[22px] h-[22px] rounded-[11px] ml-3 inline-block"></div>
                        <p className="inline-block">
                          Current temperature:{" "}
                          <span className="font-semibold">
                            {
                              tempSensor3Readings.at(
                                tempSensor3Readings.length - 1
                              )?.value
                            }
                          </span>{" "}
                          °C
                        </p>
                      </span>
                      <span className="flex flex-row w-full gap-2 justify-start items-start text-[#F4EDE5]">
                        <div className="bg-[#444545] w-[22px] h-[22px] rounded-[11px] ml-3 inline-block"></div>
                        <p className="inline-block">
                          Current humidity:{" "}
                          <span className="font-semibold">
                            {
                              humSensor1Readings.at(
                                humSensor1Readings.length - 1
                              )?.value
                            }{" "}
                            %
                          </span>
                        </p>
                      </span>
                    </div>
                    <LineChart
                      width={600}
                      height={300}
                      className="bg-[#E3DBD1] p-6 pl-0 rounded-[20px]"
                    >
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
                        stroke="#F4981D"
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
                        domain={
                          tempSensor1Readings && tempSensor1Readings.length > 0
                            ? [
                                tempSensor1Readings.at(0)!.timestampUnix,
                                tempSensor1Readings.at(
                                  tempSensor1Readings.length - 1
                                )!.timestampUnix,
                              ]
                            : []
                        }
                        type="number"
                        tickFormatter={dateFormatter}
                        interval="preserveStartEnd"
                      />
                      <YAxis />
                      <Legend />
                    </LineChart>
                    <LineChart
                      width={600}
                      height={300}
                      className="bg-[#E3DBD1] p-6 pl-0 rounded-[20px]"
                    >
                      <Line
                        name="Humidity"
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
                        domain={
                          humSensor1Readings && humSensor1Readings.length > 0
                            ? [
                                humSensor1Readings.at(0)!.timestampUnix,
                                humSensor1Readings.at(
                                  humSensor1Readings.length - 1
                                )!.timestampUnix,
                              ]
                            : []
                        }
                        type="number"
                        tickFormatter={dateFormatter}
                        interval="preserveStartEnd"
                      />
                      <YAxis />
                      <Legend />
                    </LineChart>
                  </div>
                )}
              </div>
              <div className="flex w-full h-full gap-3 bg-[#15191C] items-center flex-col justify-start rounded-3xl col-span-1 p-10">
                {editing ? (
                  <div className="flex flex-col gap-1 w-full">
                    <form
                      key={1}
                      className="flex flex-col gap-1"
                      onSubmit={handleSubmit(debounceUpdateSmokingSession)}
                    >
                      <div className="flex w-full gap-1 items-center flex-col justify-start">
                        <p className="self-start text-[#F4EDE5] font-semibold">
                          Products(s):
                        </p>
                        <Controller
                          control={control}
                          name="products"
                          rules={{ required: true }}
                          render={({
                            field: { onChange, onBlur, value, ref },
                          }) => (
                            <CreatableSelect
                              isMulti
                              placeholder="Select product..."
                              onChange={onChange} // send value to hook form
                              onBlur={onBlur} // notify when input is touched/blur
                              ref={ref}
                              value={value}
                              isClearable
                              isDisabled={isLoadingProducts}
                              isLoading={isLoadingProducts}
                              onCreateOption={handleCreateProducts}
                              options={optionsProducts}
                              styles={colourStyles}
                            />
                          )}
                        />
                        <p className="text-red-600">
                          {errors.products?.message}
                        </p>
                      </div>
                      <div className="flex w-full gap-1 items-center flex-col justify-start">
                        <p className="self-start text-[#F4EDE5] font-semibold">
                          Products(s):
                        </p>
                        <Controller
                          control={control}
                          name="woods"
                          rules={{ required: true }}
                          render={({
                            field: { onChange, onBlur, value, ref },
                          }) => (
                            <CreatableSelect
                              isMulti
                              placeholder="Select wood..."
                              onChange={onChange} // send value to hook form
                              onBlur={onBlur} // notify when input is touched/blur
                              ref={ref}
                              value={value}
                              isClearable
                              isDisabled={isLoadingWood}
                              isLoading={isLoadingWood}
                              onCreateOption={handleCreateWood}
                              options={optionsWood}
                              styles={colourStyles}
                            />
                          )}
                        />
                        <p className="text-red-600">{errors.woods?.message}</p>
                      </div>
                      <div className="flex w-full gap-1 items-center flex-col justify-start">
                        <p className="self-start text-[#F4EDE5] font-semibold">
                          Description:
                        </p>
                        <textarea
                          {...register("description")}
                          placeholder="Description"
                          className="w-full h-[140px] p-[28px] resize-none rounded-[20px] placeholder:text-[#6C6B6A] bg-[#1E2122] text-[#F4EDE5]"
                        />
                        <p className="text-red-600">
                          {errors.description?.message}
                        </p>
                      </div>

                      <ImageCarousel
                        handleAddImage={handleAddImage}
                        handleImageClick={handleImageClick}
                        handleRemoveImage={handleRemoveImage}
                        images={images}
                        editing={editing}
                        className="w-full rounded-[20px] bg-transparent text-[#F4EDE5] border-[#1E2122] border-2"
                      />
                    </form>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 justify-start items-center w-full">
                    {sessionData?.authorId === session.data?.user.id &&
                      (connectionStatus === "Open" ? (
                        !editing && (
                          <div className="flex flex-row w-[600px] gap-2 justify-center items-start text-[#F4EDE5]">
                            {!liveDataStarted && (
                              <Button
                                variant="default"
                                onClick={() => {
                                  debounceStartSmokingSession();
                                }}
                                className="w-full h-[100px] p-0 text-2xl rounded-[20px] bg-[#F4EDE5] text-[#15191C]"
                              >
                                Start
                              </Button>
                            )}
                            {liveDataStarted && (
                              <Button
                                onClick={() => debounceStopSmokingSession()}
                                variant={"destructive"}
                                className="w-full h-[100px] p-0 text-2xl rounded-[20px]"
                              >
                                Stop
                              </Button>
                            )}
                          </div>
                        )
                      ) : (
                        <div className="flex flex-row h-[100px] justify-center items-center flex-wrap gap-2 w-full p-[28px] resize-none rounded-[20px] placeholder:text-[#6C6B6A] bg-[#1E2122] text-[#F4EDE5]">
                          <p className="text-[#F4EDE5] self-center font-semibold">
                            Connecting to WebSocket Server...
                          </p>
                          <Ring color="white" size={20} />
                        </div>
                      ))}
                    <div className="flex w-full h-full gap-3 items-center flex-col justify-start">
                      <div className="flex w-full gap-1 items-center flex-col justify-start">
                        <p className="self-start text-[#F4EDE5] font-semibold">
                          Products(s):
                        </p>
                        <div className="flex flex-row flex-wrap gap-2 w-full p-[28px] resize-none rounded-[20px] placeholder:text-[#6C6B6A] bg-[#1E2122] text-[#F4EDE5]">
                          {sessionData?.products &&
                            sessionData?.products.map((product) => (
                              <SessionPill key={product} value={product} />
                            ))}
                        </div>
                      </div>
                      <div className="flex w-full gap-1 items-center flex-col justify-start">
                        <p className="self-start text-[#F4EDE5] font-semibold">
                          Woods(s):
                        </p>
                        <div className="flex flex-row flex-wrap gap-2 w-full p-[28px] resize-none rounded-[20px] placeholder:text-[#6C6B6A] bg-[#1E2122] text-[#F4EDE5]">
                          {sessionData?.woods &&
                            sessionData?.woods.map((wood) => (
                              <SessionPill key={wood} value={wood} />
                            ))}
                        </div>
                      </div>
                      <div className="flex w-full gap-1 items-center flex-col justify-start">
                        <p className="self-start text-[#F4EDE5] font-semibold">
                          Description:
                        </p>
                        <textarea
                          disabled
                          value={sessionData?.description ?? ""}
                          className="w-full h-[140px] p-[28px] resize-none rounded-[20px] placeholder:text-[#6C6B6A] bg-[#1E2122] text-[#F4EDE5]"
                        />
                      </div>
                      <ImageCarousel
                        handleAddImage={handleAddImage}
                        handleRemoveImage={handleRemoveImage}
                        handleImageClick={handleImageClick}
                        images={images}
                        editing={editing}
                        className="w-full rounded-[20px] bg-transparent text-[#F4EDE5] border-[#1E2122] border-2"
                      />
                    </div>
                  </div>
                )}
                <div className="flex flex-row w-full gap-2 justify-start items-start text-[#F4EDE5]">
                  {fromHistory && fromHistory === "true" && !editing && (
                    <Button
                      asChild
                      variant={"default"}
                      className="w-full p-0 bg-[#1E2122] text-[#F4EDE5] h-[100px] text-2xl rounded-[20px]"
                    >
                      <Link href={"/history"}>Go back to history</Link>
                    </Button>
                  )}
                  {!editing &&
                    sessionData &&
                    sessionData.authorId === session.data?.user.id && (
                      <Button
                        variant={"destructive"}
                        className="w-full h-[100px] p-0 text-2xl rounded-[20px]"
                        onClick={enableEditingMode}
                      >
                        Edit
                      </Button>
                    )}
                  {editing && (
                    <form
                      key={3}
                      className="w-full h-[100px]"
                      onSubmit={handleSubmit(debounceUpdateSmokingSession)}
                    >
                      <Button
                        variant={"default"}
                        className="w-full h-full text-[#F4EDE5] bg-orange-400 text-2xl rounded-[20px] p-0"
                        type="submit"
                      >
                        Save
                      </Button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        )
      ) : (
        <div>Invalid session id</div>
      )}
    </div>
  );
}
