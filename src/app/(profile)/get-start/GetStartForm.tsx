import { storage } from "@/lib/firebase/initialize";
import { UserData } from "@/types/UserData";
import { GetStartFormData, FormOption } from "@/types/GetStartForm";

import {
  StorageError,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import updateGetStartFormDoc from "@/lib/firebase/firestore/updateGetStartFormDoc";

interface GetStartFormProps {
  user: UserData | null;
}

const genderOptions: FormOption[] = [
  { id: "1", value: "男性" },
  { id: "2", value: "女性" },
];

const relationshipStatusOptions: FormOption[] = [
  { id: "1", value: "單身" },
  { id: "2", value: "交往中" },
  { id: "3", value: "已婚" },
  { id: "4", value: "剛分手" },
  { id: "5", value: "一言難盡" },
];

const matchGenderOptions: FormOption[] = [
  { id: "1", value: "男性" },
  { id: "2", value: "女性" },
  { id: "3", value: "都可以" },
];

const expectedRelationshipOptions: FormOption[] = [
  { id: "1", value: "閒聊" },
  { id: "2", value: "朋友" },
  { id: "3", value: "交往" },
  { id: "4", value: "結婚" },
  { id: "5", value: "長久關係" },
];

const interestOptions: FormOption[] = [
  { id: "1", value: "聊天" },
  { id: "2", value: "聽音樂" },
  { id: "3", value: "唱歌" },
  { id: "4", value: "踏青" },
  { id: "5", value: "逛街" },
  { id: "6", value: "玩遊戲" },
  { id: "7", value: "畫畫" },
  { id: "8", value: "看展覽" },
  { id: "9", value: "旅遊" },
  { id: "10", value: "健身" },
];

const GetStartForm: React.FC<GetStartFormProps> = ({ user }) => {
  const [imgFiles, setImgFiles] = useState<File[]>([]);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [formData, setFormData] = useState<GetStartFormData>({
    // isStartProfileCompleted: false,
    nickname: "",
    gender: genderOptions[0]["value"],
    relationshipStatus: relationshipStatusOptions[0]["value"],
    matchGender: matchGenderOptions[0]["value"],
    expectedRelationships: [],
    interests: [],
    imageUrls: [],
    // imageUrls: ["/team04.jpeg", "/team03.jpg", "/team01.jpeg", "/team02.webbp"],
  });
  // const [storageUploadPercent, setStorageUploadPercent] = useState(0);
  const route = useRouter();

  if (!user) {
    return null;
  }

  const handleSelectChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleMultiSelectChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    let newSelectedItems = [
      ...formData[name as keyof GetStartFormData],
    ] as string[];
    if (newSelectedItems.includes(value)) {
      newSelectedItems = newSelectedItems.filter((item) => item !== value);
    } else {
      newSelectedItems.push(value);
    }
    setFormData({ ...formData, [name]: newSelectedItems });
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      // setFormData({ ...formData, profilePictures: [...event.target.files] });

      const file = event.target.files[0];
      // setImgFiles([...imgFiles, file]);
      console.log("--> Upload imgFile start:", file);
      uploadImage(file);
      // console.log(...event.target.files);
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
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);

          console.log("Image uploaded success", imgFile);
          console.log("image url", downloadUrl);

          setImgFiles([...imgFiles, imgFile]);
          setFormData({
            ...formData,
            imageUrls: [...formData.imageUrls, downloadUrl],
          });
          // setStorageUploadPercent(0);
        },
      );
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      const result = await updateGetStartFormDoc(formData, user);

      if (result) {
        setErrorMsg("");
        alert("個人資料設定成功");
        route.push("/chat");
      }
    } catch (error) {
      if (error instanceof Error) {
        setErrorMsg(error.message);
      } else {
        setErrorMsg("Error submitting form: unknown error");
      }
    }
  };

  console.log("formData.imageUrls", formData.imageUrls);
  console.log("imgFiles", imgFiles);

  return (
    <div className="mx-auto mb-4 mt-8 max-w-4xl">
      <form onSubmit={handleSubmit} className="mx-auto max-w-xl space-y-4">
        <h2 className="mb-4 text-center text-lg font-bold ">
          Getting Start...
        </h2>
        {/* text */}
        <div>
          <label htmlFor="nickname" className="mb-2 font-medium">
            暱稱
          </label>
          <input
            type="text"
            id="nickname"
            name="nickname"
            value={formData.nickname}
            onChange={handleSelectChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            required
          />
        </div>

        {/* single-select */}
        <div>
          <label htmlFor="gender" className="mb-2 font-medium">
            性別
          </label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleSelectChange}
            className=" block w-full rounded-md border-gray-300 px-4 py-2 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            required
          >
            {genderOptions.map((gender) => (
              <option key={gender.id} value={gender.value}>
                {gender.value}
              </option>
            ))}
          </select>
        </div>

        {/* select-radio */}
        <div>
          <label className="mb-2 font-medium text-gray-700">配對性別</label>
          <div className="flex flex-wrap items-center">
            {matchGenderOptions.map((item) => (
              <div key={item.id} className="mb-2 mr-4">
                <label className="mb-2 flex items-center rounded border border-gray-300 p-2">
                  <input
                    type="radio"
                    name="matchGender"
                    value={item.value}
                    checked={formData.matchGender === item.value}
                    onChange={handleSelectChange}
                    className="h-4 w-4 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm">{item.value}</span>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* select-radio */}
        <div>
          <label className=" font-medium text-gray-700">感情狀況</label>
          <div className="mt-2 flex flex-wrap items-center">
            {relationshipStatusOptions.map((item) => (
              <div key={item.id} className="mb-2 mr-4">
                <label className=" flex items-center rounded border border-gray-300 p-2">
                  <input
                    type="radio"
                    name="relationshipStatus"
                    value={item.value}
                    checked={formData.relationshipStatus === item.value}
                    onChange={handleSelectChange}
                    className="h-4 w-4 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm">{item.value}</span>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* multi-checkbox */}
        <div>
          <label className="mb-2 font-medium text-gray-700">期望關係</label>
          <div className="mt-2 flex flex-wrap items-center">
            {expectedRelationshipOptions.map((item) => (
              <div key={item.id} className="mb-2 mr-4">
                <label className="mb-2 flex items-center rounded border border-gray-300 p-2">
                  <input
                    type="checkbox"
                    name="expectedRelationships"
                    value={item.value}
                    checked={formData.expectedRelationships.includes(
                      item.value,
                    )}
                    onChange={handleMultiSelectChange}
                    className="h-4 w-4 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm">{item.value}</span>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* multi-checkbox */}
        <div>
          <label className="mb-2 font-medium text-gray-700">興趣</label>
          <div className="flex flex-wrap items-center justify-center">
            {interestOptions.map((item) => (
              <div key={item.id} className="mb-2 mr-4">
                <label className="mb-2 flex items-center rounded border border-gray-300 p-2">
                  <input
                    type="checkbox"
                    name="interests"
                    value={item.value}
                    checked={formData.interests.includes(item.value)}
                    onChange={handleMultiSelectChange}
                    className="h-4 w-4 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm">{item.value}</span>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* file */}
        <div>
          <label className="mb-2 font-medium text-gray-700">個人圖片</label>

          {/* <div className=" flex items-center justify-start space-x-4"> */}
          <div className="grid grid-cols-4 gap-2">
            <label className="mb-2 flex h-32 w-32 cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-gray-300">
              <input
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />
              <span className="text-gray-500">+</span>
            </label>

            {formData.imageUrls.map((url, index) => (
              <div key={index} className="relative h-32 w-32">
                <Image
                  src={url}
                  alt="Uploaded picture"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-md"
                />
              </div>
            ))}

            {/* {formData.imageUrls.length > 0 && (
              <div key={0} className="relative h-32 w-32">
                <Image
                  src={formData.imageUrls[0]}
                  alt="Uploaded picture"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-md"
                />
              </div>
            )}

            {formData.imageUrls.length > 1 && (
              <div className="relative z-10 flex h-32 w-32 items-center justify-center rounded-md bg-sky-100">
                {formData.imageUrls.length > 2 && (
                  <div className="z-10 flex h-full w-full items-center justify-center">
                    <div className="absolute h-full w-full bg-blue-100 opacity-80"></div>
                    <span className="z-10 font-bold text-blue-500">
                      +{formData.imageUrls.length - 2} more
                    </span>
                  </div>
                )}
                <Image
                  src={formData.imageUrls[1]}
                  alt="Uploaded picture"
                  layout="fill"
                  objectFit="cover"
                  className="z-0 rounded-md"
                />
              </div>
            )} */}
          </div>
        </div>
        {errorMsg && <p className="mb-2 text-sm text-red-500">{errorMsg}</p>}
        <div className="mt-2 text-center">
          <button type="submit" className="btn w-[50%]">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default GetStartForm;
