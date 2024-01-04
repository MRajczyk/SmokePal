"use client";
import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import CreatableSelect from "react-select/creatable";
import { getNewSessionInitialData } from "@/app/actions/getNewSessionInit";
import {
  NewSmokingSchema,
  type NewSmokingSchemaType,
} from "@/schemas/NewSmokingSchema";
import { z } from "zod";
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

export const OptionsSchema = z.object({
  label: z.string(),
  value: z.string(),
});
export type OptionsSchemaType = z.infer<typeof OptionsSchema>;

export const SessionSelectSchema = z.object({
  id: z.number(),
  name: z.string(),
});
export type SessionSelectSchemaType = z.infer<typeof SessionSelectSchema>;

export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export type fileUploadSchemaType = {
  temporaryID: string;
  file?: File;
  b64String: string;
  dbId?: number;
};

const NewSessionPage = () => {
  const router = useRouter();
  const createOption = (label: string) => ({
    label,
    value: label.toLowerCase().replace(/\W/g, ""),
  });

  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [optionsProducts, setOptionsProducts] = useState<OptionsSchemaType[]>(
    []
  );
  const [isLoadingWood, setIsLoadingWood] = useState(false);
  const [optionsWood, setOptionsWood] = useState<OptionsSchemaType[]>([]);

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

        const productTypes: OptionsSchemaType[] = [];
        data.productTypes.forEach((productType: SessionSelectSchemaType) => {
          productTypes.push(createOption(productType.name));
        });
        setOptionsProducts(productTypes);

        const woodTypes: OptionsSchemaType[] = [];
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
      const selectedProducts: OptionsSchemaType[] = [];
      selectedProducts.concat(getValues("products"));
      selectedProducts.push(newOption);
      setValue("products", selectedProducts);
      setIsLoadingProducts(false);
    }
  };

  const handleCreateWood = async (inputValue: string) => {
    setIsLoadingWood(true);
    const res = await createNewWoodType(inputValue);
    if (res.success) {
      const newOption = createOption(inputValue);
      setOptionsWood((prev) => [...prev, newOption]);
      const selectedWoods: OptionsSchemaType[] = [];
      selectedWoods.concat(getValues("woods"));
      selectedWoods.push(newOption);
      setValue("woods", selectedWoods);
      setIsLoadingWood(false);
    }
  };

  return (
    <div className="flex flex-col w-full h-full">
      <div className="text-4xl p-8">
        <b>Nowe wędzenie</b>
      </div>
      <div className="grid grid-cols-2 w-full h-full">
        <div className="flex border-2 border-red-600 mx-4 mb-4">
          <div className="flex flex-col gap-1">
            <form
              key={0}
              className="flex flex-col gap-1"
              onSubmit={handleSubmit(handleFormSubmit)}
            >
              <input {...register("title")} placeholder="title" />
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
                  />
                )}
              />
              <p className="text-red-600">{errors.woods?.message}</p>

              <textarea
                {...register("description")}
                placeholder="description"
                className="resize-none"
              />
              <p className="text-red-600">{errors.description?.message}</p>
            </form>
            <ImageCarousel
              handleAddImage={handleAddImage}
              handleRemoveImage={handleRemoveImage}
              images={images}
              editing={true}
            />
          </div>
        </div>
        <div className="flex border-2 border-red-600 mx-4 mb-4">
          <form
            key={1}
            className="flex flex-col gap-1"
            onSubmit={handleSubmit(handleFormSubmit)}
          >
            <input
              {...register("tempSensor1Name")}
              placeholder="Red sensor name"
            />
            <p className="text-red-600">{errors.tempSensor1Name?.message}</p>

            <input
              {...register("tempSensor2Name")}
              placeholder="Green sensor name"
            />
            <p className="text-red-600">{errors.tempSensor2Name?.message}</p>

            <input
              {...register("tempSensor3Name")}
              placeholder="Blue sensor name"
            />
            <p className="text-red-600">{errors.tempSensor3Name?.message}</p>

            <Button type="submit">Rozpocznij wędzenie</Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewSessionPage;
