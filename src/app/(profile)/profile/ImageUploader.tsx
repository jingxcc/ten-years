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
  useEffect(() => {}, []);

  const handleImgUpload = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      console.log("--> Upload imgFile start:", file);
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

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

          // setStorageUploadPercent(progress);
          console.log(`Image upload is ${progress} % done`);

          switch (snapshot.state) {
            case "paused":
              console.log("upload is paused");
              break;
            case "running":
              console.log("upload is running");
              break;
          }
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

            console.log("Image uploaded success", imgFile);
            console.log("image url", downloadUrl);

            onImageUpload(downloadUrl);

            // setStorageUploadPercent(0);
          } catch (error) {
            console.error("Image Upload Error", error);
          }
        },
      );
    }
  };

  const handleImgDelete = async (event: FormEvent, imgId: number) => {
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
    } catch (error) {
      console.error("Image Delete Error", error);
    }
  };

  return (
    <div className="grid grid-cols-4 gap-2">
      <label className="mb-2 flex h-32 w-32 cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-gray-300 text-sky-300 hover:border-sky-300 hover:bg-sky-100 hover:text-sky-500">
        <input type="file" className="hidden" onChange={handleImgUpload} />

        <PlusIcon className="h-6 w-6 " />
      </label>

      {imgUrlsObj.length > 0 &&
        imgUrlsObj.map((imgUrl) => (
          <div key={imgUrl.id} className="relative h-32 w-32">
            <Image
              src={imgUrl.url}
              alt="Uploaded picture"
              layout="fill"
              objectFit="cover"
              className="rounded-md"
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
    </div>
  );
}
