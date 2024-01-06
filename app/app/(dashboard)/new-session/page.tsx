"use client";
import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import CreatableSelect from "react-select/creatable";
import { StylesConfig } from "react-select";
import { getNewSessionInitialData } from "@/app/actions/getNewSessionInit";
import {
  NewSmokingSchema,
  type NewSmokingSchemaType,
} from "@/schemas/NewSmokingSchema";
import { createNewSmokingSession } from "@/app/actions/createNewSmokingSession";
import { useRouter } from "next/navigation";
import debounce from "just-debounce-it";
import { SUBMIT_DEBOUNCE_MS } from "@/lib/utils";
import { useMutation } from "react-query";
import { createZodFetcher } from "zod-fetch";
import { fetcher } from "@/lib/utils";
import defaultResponseSchema from "@/schemas/defaultResponseSchema";
import { createNewProductType } from "@/app/actions/createNewProductType";
import { createNewWoodType } from "@/app/actions/createNewWoodType";
import { v4 as uuidv4 } from "uuid";
import ImageCarousel from "@/components/ui/imageCarousel";
import {
  type SelectOptionsSchemaType,
  type SessionSelectSchemaType,
} from "@/schemas/NewSessionSchemas";
import {
  ACCEPTED_IMAGE_TYPES,
  type fileUploadSchemaType,
} from "@/schemas/NewSessionSchemas";

const NewSessionPage = () => {
  const router = useRouter();
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

  const [images, setImages] = useState<fileUploadSchemaType[]>([]);

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

  function handleRemoveImage(imageUUID: string) {
    setImages(images.filter((image) => image.temporaryID !== imageUUID));
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
    // isLoading: isLoadingStop,
    // isSuccess: isSuccessStop,
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
  } = useForm<NewSmokingSchemaType>({
    mode: "all",
    resolver: zodResolver(NewSmokingSchema),
  });

  const handleFormSubmit = async (data: NewSmokingSchemaType) => {
    //maybe move to on success callback in mutation, idk
    debounceStopSmokingSession();
    const formData = new FormData();
    for (let i = 0; i < images.length; ++i) {
      if (!images[i].file) {
        continue;
      }
      formData.append("files[]", images[i].file!);
    }

    const res = await createNewSmokingSession(data, formData);
    if (res.success === true && res.data) {
      router.push(`/session/${JSON.parse(res.data).sessionId}`, {
        scroll: false,
      });
    } else {
      alert("Could not create new session");
    }
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

  const colourStyles: StylesConfig = {
    control: (styles) => ({
      ...styles,
      backgroundColor: "#1E2122",
      borderWidth: 0,
      minHeight: 90,
      color: "#6C6B6A",
      boxShadow: "none",
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
    placeholder: (styles) => ({ ...styles }),
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
    multiValueRemove: (styles) => ({ ...styles, height: 22 }),
    valueContainer: (styles) => ({ ...styles, padding: 28 }),
  };

  return (
    <div className="flex flex-col w-full h-full items-center justify-start">
      <div className="text-5xl p-8 text-[#F4EDE5] font-semibold">
        Start new session
      </div>
      <div className="grid grid-cols-2 w-[1400px] gap-4 grid-rows-4 h-full mb-[100px]">
        <div className="flex row-span-4 bg-[#15191C] col-span-1 flex-col gap-1 justify-center items-center w-full p-[50px] rounded-[20px]">
          <form
            key={0}
            className="flex flex-col gap-[6px] w-[470px]"
            onSubmit={handleSubmit(handleFormSubmit)}
          >
            <input
              {...register("title")}
              placeholder="Title"
              className="w-full h-[90px] p-[38px] rounded-[9px] placeholder:text-[#6C6B6A] bg-[#1E2122] text-[#F4EDE5]"
            />
            <p className="text-red-600">{errors.title?.message}</p>

            <Controller
              control={control}
              name="products"
              render={({ field: { onChange, onBlur, value, ref } }) => (
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
            <p className="text-red-600">{errors.products?.message}</p>

            <Controller
              control={control}
              name="woods"
              render={({ field: { onChange, onBlur, value, ref } }) => (
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

            <textarea
              {...register("description")}
              placeholder="Add a description..."
              className="w-full h-[140px] p-[38px] resize-none rounded-[9px] placeholder:text-[#6C6B6A] bg-[#1E2122] text-[#F4EDE5]"
            />
            <p className="text-red-600">{errors.description?.message}</p>
          </form>
          <ImageCarousel
            handleAddImage={handleAddImage}
            handleRemoveImage={handleRemoveImage}
            images={images}
            editing={true}
            className="w-[470px] rounded-[9px] bg-transparent text-[#F4EDE5] border-[#1E2122] border-2"
          />
        </div>
        <div className="flex bg-[#15191C] col-span-1 row-span-3 flex-col gap-1 justify-center items-center w-full p-[50px] rounded-[20px]">
          <form
            key={1}
            className="flex flex-col gap-3"
            onSubmit={handleSubmit(handleFormSubmit)}
          >
            <div>
              <span className="flex flex-row gap-2 justify-start items-center text-[#F4EDE5] mb-3">
                <div className="bg-[#D1271C] w-[22px] h-[22px] rounded-[11px] ml-3 inline-block"></div>
                <p className="inline-block">Red sensor</p>
              </span>
              <input
                {...register("tempSensor1Name")}
                placeholder="Red sensor name"
                className="w-[470px] h-[90px] p-[38px] rounded-[9px] placeholder:text-[#6C6B6A] bg-[#1E2122] text-[#F4EDE5]"
              />
              <p className="text-red-600 mt-1">
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
                className="w-[470px] h-[90px] p-[38px] rounded-[9px] placeholder:text-[#6C6B6A] bg-[#1E2122] text-[#F4EDE5]"
              />
              {errors.tempSensor2Name && (
                <p className="text-red-600 mt-1">
                  {errors.tempSensor2Name?.message}
                </p>
              )}
            </div>

            <div>
              <span className="flex flex-row gap-2 justify-start items-center text-[#F4EDE5] mb-3">
                <div className="bg-[#211ECC] w-[22px] h-[22px] rounded-[11px] ml-3 inline-block"></div>
                <p className="inline-block">Blue sensor</p>
              </span>
              <input
                {...register("tempSensor3Name")}
                placeholder="Blue sensor name"
                className="w-[470px] h-[90px] p-[38px] rounded-[9px] placeholder:text-[#6C6B6A] bg-[#1E2122] text-[#F4EDE5]"
              />
              {errors.tempSensor3Name && (
                <p className="text-red-600 mt-1">
                  {errors.tempSensor3Name?.message}
                </p>
              )}
            </div>
          </form>
        </div>
        <form key={2} onSubmit={handleSubmit(handleFormSubmit)}>
          <Button
            variant={"gradient"}
            type="submit"
            className="col-span-1 row-span-1 w-full h-full text-4xl font-semibold rounded-[20px]"
          >
            Start new session!
          </Button>
        </form>
      </div>
    </div>
  );
};

export default NewSessionPage;
