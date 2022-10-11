import Image from "next/image";
import { ChangeEvent, useCallback } from "react";

type Props = {
  inputName?: string;
  image: string;
  setImage: (image: string) => void;
  clearImage: () => void;
};

const ImageInput = (props: Props) => {
  const { image, setImage, clearImage, inputName } = props;

  const handleClearImage = useCallback(() => {
    clearImage();
  }, [clearImage]);

  const handleImageChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          if (typeof reader.result === "string") {
            setImage(reader.result);
          }
        };
      }
    },
    [setImage]
  );

  return (
    <div className="flex flex-col">
      {inputName && <span className="font-bold mb">{inputName}</span>}
      {image ? (
        <div className="flex w-full">
          <Image
            src={image ?? ""}
            objectFit="contain"
            width={"120px"}
            height={"120px"}
            alt="apartment Logo"
            placeholder="empty"
          />
          <button
            className="p-2 ml-2 rounded-full bg-red-500 text-white"
            style={{
              background: "url(/Styles/Assets/Images/xCircle.svg)",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              width: "40px",
            }}
            onClick={handleClearImage}
          />
        </div>
      ) : (
        <div>
          <label
            htmlFor="apartment-logo"
            className="block h-24 w-28 rounded-lg border-2 hover:border-blue-700 hover:cursor-pointer border-dashed border-blue-400"
            style={{
              background: "url(/Styles/Assets/Images/upload.svg)",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              backgroundSize: "50%",
            }}
          >
            <div className="add-icon" />
          </label>
          <input
            id="apartment-logo"
            name="apartment-logo"
            className="hidden"
            type="file"
            accept="image/png, image/gif, image/jpeg"
            onChange={handleImageChange}
          />
        </div>
      )}
    </div>
  );
};

export default ImageInput;
