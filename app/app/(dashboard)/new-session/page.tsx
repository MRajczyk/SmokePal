"use client";
import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import CreatableSelect from "react-select/creatable";
import { getNewSessionInitialData } from "@/app/actions/getNewSessionInit";

export const NewSmokingSchema = z.object({
  title: z.string().min(1, "Title is required"),
  product: z.object({
    label: z.string().min(1, "Label is required"),
    value: z.string().min(1, "Value is required"),
  }),
  wood: z.object({
    label: z.string().min(1, "Label is required"),
    value: z.string().min(1, "Value is required"),
  }),
  description: z.string().optional(),
  tempSensor1Name: z.string().min(1, "Name is required"),
  tempSensor2Name: z.string().min(1, "Name is required"),
  tempSensor3Name: z.string().min(1, "Name is required"),
});
export type NewSmokingSchemaType = z.infer<typeof NewSmokingSchema>;

const NewSessionPage = () => {
  const createOption = (label: string) => ({
    label,
    value: label.toLowerCase().replace(/\W/g, ""),
  });

  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [optionsProducts, setOptionsProducts] = useState<
    { label: string; value: string }[]
  >([]);
  const [isLoadingWood, setIsLoadingWood] = useState(false);
  const [optionsWood, setOptionsWood] = useState<
    { label: string; value: string }[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getNewSessionInitialData();

      if (res.success === true) {
        //use zod parser or w/e type def is not that terrible idk
        const data: {
          woodTypes: [{ id: number; name: string }];
          productTypes: [{ id: number; name: string }];
        } = JSON.parse(res.data ?? "");

        const productTypes: { label: string; value: string }[] = [];
        data.productTypes.forEach(
          (productType: { id: number; name: string }) => {
            productTypes.push(createOption(productType.name));
          }
        );
        setOptionsProducts(productTypes);

        const woodTypes: { label: string; value: string }[] = [];
        data.woodTypes.forEach((woodType: { id: number; name: string }) => {
          woodTypes.push(createOption(woodType.name));
        });
        setOptionsWood(woodTypes);
      }
    };

    fetchData().catch(console.error);
  }, []);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewSmokingSchemaType>({
    mode: "all",
    resolver: zodResolver(NewSmokingSchema),
  });

  const onSubmit = async (data: NewSmokingSchemaType) => {
    console.log(data);
    // if (res.success === true) {
    //   alert("Registered successfully!");
    // } else {
    //   alert("Could not register user");
    // }
  };

  const handleCreateProducts = (inputValue: string) => {
    setIsLoadingProducts(true);
    setTimeout(() => {
      const newOption = createOption(inputValue);
      setIsLoadingProducts(false);
      setOptionsProducts((prev) => [...prev, newOption]);
    }, 1000);
  };

  const handleCreateWood = (inputValue: string) => {
    setIsLoadingWood(true);
    setTimeout(() => {
      const newOption = createOption(inputValue);
      setIsLoadingWood(false);
      setOptionsWood((prev) => [...prev, newOption]);
    }, 1000);
  };

  return (
    <div className="flex flex-col w-full h-full">
      <div className="text-4xl p-8">
        <b>Nowe wędzenie</b>
      </div>
      <div className="grid grid-cols-2 w-full h-full">
        <div className="flex bg-yellow-100 border-2 border-red-600 mx-4 mb-4">
          <form
            key={1}
            className="flex flex-col gap-1"
            onSubmit={handleSubmit(onSubmit)}
          >
            <input {...register("title")} placeholder="title" />
            <p className="text-red-600">{errors.title?.message}</p>

            <Controller
              control={control}
              name="product"
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <CreatableSelect
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

            <Controller
              control={control}
              name="wood"
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <CreatableSelect
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

            <input {...register("description")} placeholder="description" />
            <p className="text-red-600">{errors.description?.message}</p>
          </form>
        </div>
        <div className="flex bg-green-100 border-2 border-red-600 mx-4 mb-4">
          <form
            key={2}
            className="flex flex-col gap-1"
            onSubmit={handleSubmit(onSubmit)}
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
