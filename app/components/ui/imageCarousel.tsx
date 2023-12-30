"use client";
import React, { useRef } from "react";
import { fileUploadSchemaType } from "@/app/(dashboard)/new-session/page";
import ImageCarouselItem from "./imageCarouselItem";
import AddIcon from "@/public/assets/add_icon.svg";
import Image from "next/image";

interface ImageCarouselProps {
  handleAddImage: (file: File) => void;
  handleRemoveImage: (uuid: string) => void;
  images: fileUploadSchemaType[] | undefined;
  editing?: boolean;
}

const ImageCarousel = ({
  handleAddImage,
  handleRemoveImage,
  images,
  editing,
}: ImageCarouselProps) => {
  function addImage(e: any) {
    console.log("remove clicked", e);
    handleAddImage(e.target.files[0]);
  }

  const fileInput = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-row gap-5 border-2 border-solid border-gray-300 h-fit p-4 w-[400px] overflow-x-auto rounded-xl">
      {images &&
        images.map((image) => (
          <ImageCarouselItem
            key={image.temporaryID}
            handleRemoveImage={handleRemoveImage}
            b64URL={image.b64String}
            width={100}
            height={100}
            imageUuid={image.temporaryID}
            editing={editing}
          />
        ))}
      <div className="flex shrink-0 w-[100px] h-[100px] items-center justify-center bg-gray-100 rounded-2xl">
        <input
          id="img_input"
          ref={fileInput}
          className="hidden"
          onChange={addImage}
          type="file"
        />
        <Image
          src={AddIcon}
          alt="Add image icon"
          width={60}
          height={60}
          className="cursor-pointer opacity-50"
          onClick={() => fileInput?.current?.click()}
        />
      </div>
    </div>
  );
};

export default ImageCarousel;
