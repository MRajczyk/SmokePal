"use client";
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import CreatableSelect from "react-select/creatable";

export const NewSmokingSchema = z.object({
  title: z.string().min(1, "Title is required"),
  product: z.object({
    label: z.string().min(1, "Label is required"),
    value: z.string().min(1, "Value is required"),
  }),
  wood: z.string().min(1, "Wood type is required"),
  description: z.string().optional(),
  tempSensor1Name: z.string().min(1, "Description is required"),
  tempSensor2Name: z.string().min(1, "Description is required"),
  tempSensor3Name: z.string().min(1, "Description is required"),
});
export type NewSmokingSchemaType = z.infer<typeof NewSmokingSchema>;

const NewSessionPage = () => {
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

  ///////////////////////////////////////////////// create select test:
  const createOption = (label: string) => ({
    label,
    value: label.toLowerCase().replace(/\W/g, ""),
  });

  const defaultOptions = [
    createOption("One"),
    createOption("Two"),
    createOption("Three"),
  ];

  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState(defaultOptions);

  const handleCreate = (inputValue: string) => {
    setIsLoading(true);
    setTimeout(() => {
      const newOption = createOption(inputValue);
      setIsLoading(false);
      setOptions((prev) => [...prev, newOption]);
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
                  defaultValue={{ label: "One", value: "one" }}
                  value={value}
                  isClearable
                  isDisabled={isLoading}
                  isLoading={isLoading}
                  onCreateOption={handleCreate}
                  options={options}
                />
              )}
            />

            <input {...register("wood")} placeholder="wood" />
            <p className="text-red-600">{errors.wood?.message}</p>

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
