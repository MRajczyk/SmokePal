import React from "react";
import DeleteIcon from "@/public/assets/delete.png";
import Image from "next/image";

interface ImageCarouselItemProps {
  handleRemoveImage: (uuid: string) => void;
  b64URL: string;
  width: number;
  height: number;
  imageUuid: string;
  editing?: boolean;
}

const ImageCarouselItem = ({
  handleRemoveImage,
  b64URL,
  width,
  height,
  imageUuid,
  editing,
}: ImageCarouselItemProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function removeImage(_e: React.MouseEvent<HTMLImageElement>) {
    handleRemoveImage(imageUuid);
  }

  return (
    <div className="relative flex shrink-0 rounded-2xl">
      <Image
        src={b64URL}
        alt="Picture uploaded by user"
        width={width}
        height={height}
        style={{
          objectFit: "cover",
          maxHeight: `${height}px`,
          borderRadius: 16,
        }}
      />
      {editing && (
        <Image
          src={DeleteIcon}
          alt="Delete icon"
          width={20}
          height={20}
          onClick={removeImage}
          className="absolute top-[-10px] right-[-10px] cursor-pointer"
        />
      )}
    </div>
  );
};

export default ImageCarouselItem;
