/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import useWebSocket, { ReadyState } from "react-use-websocket";
import debounce from "just-debounce-it";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SUBMIT_DEBOUNCE_MS } from "@/lib/utils";
import { useMutation } from "react-query";
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
  const [fetchingHistoricalData, setFetchingHistoricalData] =
    useState<boolean>(false);
  const [editing, setEditing] = useState<boolean>(false);

  const socketUrl = "ws://localhost:7071";
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

  async function startSmokingSession() {
    startSmokingSessionAction(params.sessionId);
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
    stopSmokingSessionAction();
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
      sessionData.products.forEach((wood) => {
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

  return (
    <div className="flex w-full h-full flex-col items-center justify-center">
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
          <Ring color="orange" size={100} />
        ) : (
          <div>
            {!editing && (
              <Button
                variant={"destructive"}
                className="w-[300px] mt-4"
                onClick={enableEditingMode}
              >
                Edit
              </Button>
            )}
            {editing && (
              <form
                key={1}
                className="flex flex-col gap-1"
                onSubmit={handleSubmit(debounceUpdateSmokingSession)}
              >
                <Button
                  variant={"default"}
                  className="w-[300px] mt-4 bg-orange-400"
                  type="submit"
                >
                  Save
                </Button>
              </form>
            )}
            <p>Session id: {params.sessionId}</p>
            {sessionData && (
              <div>
                {editing ? (
                  <div className="flex flex-col gap-1">
                    <form
                      key={0}
                      className="flex flex-col gap-1"
                      onSubmit={handleSubmit(debounceUpdateSmokingSession)}
                    >
                      <input {...register("title")} placeholder="title" />
                      <p className="text-red-600">{errors.title?.message}</p>

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
                          />
                        )}
                      />
                      <p className="text-red-600">{errors.products?.message}</p>

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
                          />
                        )}
                      />
                      <p className="text-red-600">{errors.woods?.message}</p>

                      <textarea
                        {...register("description")}
                        placeholder="description"
                        className="resize-none"
                      />
                      <p className="text-red-600">
                        {errors.description?.message}
                      </p>

                      <input
                        {...register("tempSensor1Name")}
                        placeholder="Red sensor name"
                      />
                      <p className="text-red-600">
                        {errors.tempSensor1Name?.message}
                      </p>

                      <input
                        {...register("tempSensor2Name")}
                        placeholder="Green sensor name"
                      />
                      <p className="text-red-600">
                        {errors.tempSensor2Name?.message}
                      </p>

                      <input
                        {...register("tempSensor3Name")}
                        placeholder="Blue sensor name"
                      />
                      <p className="text-red-600">
                        {errors.tempSensor3Name?.message}
                      </p>
                    </form>
                  </div>
                ) : (
                  <div>
                    <p>Session title: {sessionData.title}</p>
                    <p>Session woods: {sessionData.woods.join(", ")}</p>
                    <p>Session products: {sessionData.products.join(", ")}</p>
                    <textarea
                      disabled
                      value={sessionData.description ?? ""}
                      className="resize-none"
                    />
                  </div>
                )}
                <p>
                  Current temp1:{" "}
                  {
                    tempSensor1Readings.at(tempSensor1Readings.length - 1)
                      ?.value
                  }
                </p>
                <p>
                  Current temp2:{" "}
                  {
                    tempSensor2Readings.at(tempSensor2Readings.length - 1)
                      ?.value
                  }
                </p>
                <p>
                  Current temp3:{" "}
                  {
                    tempSensor3Readings.at(tempSensor3Readings.length - 1)
                      ?.value
                  }
                </p>
                <p>
                  Current hum1:{" "}
                  {humSensor1Readings.at(humSensor1Readings.length - 1)?.value}
                </p>
              </div>
            )}
            {sessionFinished !== undefined && !sessionFinished && (
              <div>
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
              </div>
            )}
            <br />
            <p>The WebSocket is currently {connectionStatus}</p>
            <p>Humidity readings over time</p>
            {humSensor1Readings.length > 0 && (
              <LineChart width={600} height={300}>
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
                <Legend />
              </LineChart>
            )}
            <p>Temperature readings over time</p>
            {tempSensor1Readings.length > 0 && (
              <LineChart width={600} height={300}>
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
                <Legend />
              </LineChart>
            )}
          </div>
        )
      ) : (
        <div>Invalid session id</div>
      )}
      <ImageCarousel
        handleAddImage={handleAddImage}
        handleRemoveImage={handleRemoveImage}
        handleImageClick={handleImageClick}
        images={images}
        editing={editing}
        className="mt-4"
      />
      {fromHistory && fromHistory === "true" && (
        <Button asChild variant={"destructive"} className="w-[300px] mt-4">
          <Link href={"/history"}>Go back to history</Link>
        </Button>
      )}
    </div>
  );
}
