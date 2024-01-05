"use client";
import React, { useRef } from "react";
import { type fileUploadSchemaType } from "@/schemas/NewSessionSchemas";
import ImageCarouselItem from "./imageCarouselItem";
// @ts-expect-error this library doesnt support typescript at all.............
import AddIcon from "@/public/assets/add_icon.svg?url";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ImageCarouselProps {
  handleAddImage: (file: File) => void;
  handleRemoveImage: (uuid: string) => void;
  images: fileUploadSchemaType[] | undefined;
  handleImageClick?: (uuid: string) => void;
  editing?: boolean;
  className?: string;
}

const ImageCarousel = ({
  handleAddImage,
  handleRemoveImage,
  handleImageClick,
  images,
  editing,
  className,
}: ImageCarouselProps) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function addImage(e: any) {
    console.log("remove clicked", e);
    handleAddImage(e.target.files[0]);
  }

  const fileInput = useRef<HTMLInputElement>(null);

  return (
    <>
      {(editing || (images && images.length > 0)) && (
        <div
          className={cn(
            "flex flex-row shrink-0 gap-5 border-2 border-solid border-gray-300 h-fit p-2 w-[400px] overflow-x-auto rounded-xl",
            className
          )}
        >
          {images &&
            images.map((image) => (
              <ImageCarouselItem
                key={image.temporaryID}
                handleRemoveImage={handleRemoveImage}
                b64URL={image.b64String}
                width={120}
                height={120}
                imageUuid={image.temporaryID}
                editing={editing}
                handleImageClick={handleImageClick}
              />
            ))}
          {editing && (
            <div className="flex shrink-0 w-[120px] h-[120px] items-center justify-center bg-gray-100 rounded-2xl">
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
                className="cursor-pointer"
                onClick={() => fileInput?.current?.click()}
              />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ImageCarousel;
