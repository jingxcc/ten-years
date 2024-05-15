import { formOptionLimits } from "@/constants/GetStartForm";
import { storage } from "@/lib/firebase/initialize";
import { ImageUrlsObj } from "@/types/GetStartForm";
import { UserData } from "@/types/UserData";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";

import {
  StorageError,
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import Image from "next/image";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";

interface ImageUploaderProps {
  user: UserData;
  imgUrlsObj: ImageUrlsObj[];
  onImageUpload: (urlAdded: string) => void;
  onImageDelete: (leftUrlsObj: ImageUrlsObj[]) => void;
}

export default function ImageUploader({
  user,
  imgUrlsObj,
  onImageUpload,
  onImageDelete,
}: ImageUploaderProps) {
  const [uploadingImgs, setUplodingImgs] = useState<{ [id: string]: Boolean }>(
    {},
  );
  const remainingSlots =
    formOptionLimits.imageUrls -
    imgUrlsObj.length -
    Object.keys(uploadingImgs).length;

  const handleImgUpload = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      uploadImage(file);
    }
    function uploadImage(imgFile: File) {
      const imageMetadata = {
        contentType: "image/jpeg",
      };
      const timestamp = new Date().getTime();
      const storageRef = ref(
        storage,
        `users/${user?.uid}/${timestamp}_${imgFile.name}`,
      );
      const uploadTask = uploadBytesResumable(
        storageRef,
        imgFile,
        imageMetadata,
      );
      const newImgId = crypto.randomUUID();
      setUplodingImgs((prev) => ({ ...prev, [newImgId]: true }));

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // switch (snapshot.state) {
          //   case "paused":
          //     console.log("upload is paused");
          //     break;
          //   case "running":
          //     console.log("upload is running");
          //     break;
          // }
        },
        (error) => {
          if (error instanceof StorageError) {
            console.error("Image Upload Error: ", error.message);
          } else {
            console.error("Image Upload Error: ", error);
          }
        },
        async () => {
          try {
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);

            onImageUpload(downloadUrl);

            setUplodingImgs((prev) => {
              const updateData = { ...prev };
              delete updateData[newImgId];
              return updateData;
            });

            toast.success("Image Uploaded Successfully");
          } catch (error) {
            console.error("Image Upload Error", error);
            toast.error("Image Uploaded Failed");
          }
        },
      );
    }
  };

  const handleImgDelete = async (event: FormEvent, imgId: string) => {
    event.preventDefault();

    try {
      let itemToRemove = imgUrlsObj.find((item) => item.id === imgId);
      if (!itemToRemove) {
        throw new Error("Image Delete Error");
      }

      let imgRef = ref(storage, itemToRemove.url);
      await deleteObject(imgRef);

      let dataToUpdate: ImageUrlsObj[] = imgUrlsObj.filter(
        (item) => item.id !== imgId,
      );

      onImageDelete(dataToUpdate);
      toast.success("Image Deleted Successfully");
    } catch (error) {
      console.error("Image Delete Error", error);
      toast.error("Image Deleted Failed");
    }
  };

  return (
    <div className="flex justify-center">
      <div className="[500px]:gap-x-4 [500px]:grid-cols-3 grid grid-cols-2 gap-6 xs:gap-y-2 sm:grid-cols-4">
        {imgUrlsObj.length > 0 &&
          imgUrlsObj.map((imgUrl) => (
            <div key={imgUrl.id} className="relative h-32 w-32">
              <Image
                src={imgUrl.url}
                alt="Uploaded picture"
                width={280}
                height={280}
                className="h-full w-full rounded-md border-sky-300 bg-sky-100 object-cover text-sky-300"
              />
              <button
                className={
                  "absolute right-[-8px] top-[-8px] flex h-8 w-8 items-center justify-center rounded-full bg-sky-100  text-sky-300 shadow-lg hover:bg-neutral-100  hover:text-neutral-500"
                }
                onClick={(e) => handleImgDelete(e, imgUrl.id)}
              >
                <XMarkIcon className="h-6 w-6 " />
              </button>
            </div>
          ))}
        {Object.keys(uploadingImgs).map((id) => (
          <label
            key={id}
            className="flex h-32 w-32 cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-sky-300 bg-gray-100 text-sky-300 "
          >
            <input type="file" className="hidden" disabled />
            <span>Uploading...</span>
          </label>
        ))}
        {Array.from({ length: remainingSlots }).map((_, index) => (
          <label
            key={index}
            className="flex h-32 w-32 cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-gray-300 text-sky-300 hover:border-sky-300 hover:bg-sky-100 hover:text-sky-500"
          >
            <input type="file" className="hidden" onChange={handleImgUpload} />
            <PlusIcon className="h-6 w-6 " />
          </label>
        ))}
      </div>
    </div>
  );
}
