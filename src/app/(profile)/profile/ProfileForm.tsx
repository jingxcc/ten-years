import { firestore, storage } from "@/lib/firebase/initialize";
import { UserData } from "@/types/UserData";

import {
  genderOptions,
  relationshipStatusOptions,
  matchGenderOptions,
  expectedRelationshipOptions,
  interestOptions,
} from "@/constants/GetStartForm";

import {
  StorageError,
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import Image from "next/image";
import { ChangeEvent, FormEvent, ReactNode, useEffect, useState } from "react";
import updateGetStartFormDoc, {
  autoUpdateImageUrls,
} from "@/lib/firebase/firestore/updateGetStartFormDoc";
import {
  GetStartFormData,
  ImageUrlsObj,
  ProfileFormData,
} from "@/types/GetStartForm";
import fetchUserDoc from "@/lib/firebase/firestore/fetchUserDoc";
import updateProfileForm from "@/lib/firebase/firestore/updateProfileForm";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import ImageUploader from "@/components/ImageUploader/ImageUploader";
import { doc } from "firebase/firestore";
import toast from "react-hot-toast";

interface ProfileFormProps {
  user: UserData;
  children?: ReactNode;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ user, children }) => {
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [formData, setFormData] = useState<ProfileFormData>({
    // isStartProfileCompleted: false,
    nickname: "",
    gender: genderOptions[0]["value"],
    relationshipStatus: relationshipStatusOptions[0]["value"],
    matchGender: matchGenderOptions[0]["value"],
    expectedRelationships: [],
    interests: [],
    imageUrls: [],
    aboutMe: "",
    // imageUrls: ["/team04.jpeg", "/team03.jpg", "/team01.jpeg", "/team02.webbp"],
  });
  const [imgUrlsObj, setImgUrlsObj] = useState<ImageUrlsObj[]>([]);
  const [infoMsg, setInfoMsg] = useState<{ string: number }[]>([]);

  // const [storageUploadPercent, setStorageUploadPercent] = useState(0);

  // if (!user) {
  //   return null;
  // }

  useEffect(() => {
    // extract/context
    const fetchUserDocData = async () => {
      const fetchUserDocResult = await fetchUserDoc(user);

      if (!fetchUserDocResult) return false;
      const fetchUpdateFormData = fetchUserDocResult.data;
      const fetchData = {
        nickname: fetchUpdateFormData?.nickname ?? "",
        gender: fetchUpdateFormData?.gender ?? genderOptions[0]["value"],
        relationshipStatus:
          fetchUpdateFormData?.relationshipStatus ??
          relationshipStatusOptions[0]["value"],
        matchGender:
          fetchUpdateFormData?.matchGender ?? matchGenderOptions[0]["value"],
        expectedRelationships: fetchUpdateFormData?.expectedRelationships ?? [],
        interests: fetchUpdateFormData?.interests ?? [],
        imageUrls: fetchUpdateFormData?.imageUrls ?? [],

        aboutMe: fetchUserDocResult.data?.aboutMe ?? "",
      };
      setFormData(fetchData);

      let dataToUpdate: ImageUrlsObj[] = [];
      fetchData.imageUrls.forEach((data) => {
        let obj = { id: crypto.randomUUID(), url: data };
        dataToUpdate.push(obj);
      });
      setImgUrlsObj(dataToUpdate);
    };
    fetchUserDocData();
  }, [user]);

  const handleSelectChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleMultiSelectChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const mutiSelectKeys: Array<keyof ProfileFormData> = [
      "expectedRelationships",
      "interests",
      "imageUrls",
    ];
    // tmp: type

    if (!mutiSelectKeys.includes(name as keyof ProfileFormData)) {
      return false;
    }

    // tmp: add a fallback if formData[name] not exists
    let newSelectedItems = [
      ...(formData[name as keyof ProfileFormData] || []),
    ] as string[];

    if (newSelectedItems.includes(value)) {
      newSelectedItems = newSelectedItems.filter((item) => item !== value);
    } else {
      newSelectedItems.push(value);
    }
    setFormData({ ...formData, [name]: newSelectedItems });
  };

  const handleSave = async (event: FormEvent) => {
    event.preventDefault();

    try {
      // update user data
      const result = await updateProfileForm(formData, user);

      if (result) {
        setErrorMsg("");
        toast.success("Profile Updated Successesfully", { icon: "🎉" });
        // route.push("/chat");
      }
    } catch (error) {
      if (error instanceof Error) {
        setErrorMsg(error.message);
      } else {
        setErrorMsg("Error submitting form: unknown error");
      }
    }
  };

  // ImageUploader
  const handleImageUpload = (urlAdded: string) => {
    let arrayToUpdate = [...formData.imageUrls, urlAdded];
    autoUpdateImageUrls(user, arrayToUpdate);

    setFormData({
      ...formData,
      imageUrls: arrayToUpdate,
    });

    let dataToUpdate: ImageUrlsObj[] = imgUrlsObj;

    dataToUpdate.push({
      id: crypto.randomUUID(),
      url: urlAdded,
    });
    setImgUrlsObj(dataToUpdate);
  };

  // ImageUploader
  const handleImageDelete = (leftUrlsObj: ImageUrlsObj[]) => {
    let arrayToUpdate = leftUrlsObj.map((data) => data.url);
    autoUpdateImageUrls(user, arrayToUpdate);
    setFormData({ ...formData, imageUrls: arrayToUpdate });

    setImgUrlsObj(leftUrlsObj);
  };

  // console.log("imgUrlsObj", imgUrlsObj);

  return (
    <div className="mx-auto mb-4 mt-8 max-w-4xl">
      <form
        onSubmit={handleSave}
        className="mx-auto max-w-xl space-y-4 px-4 pb-8"
      >
        <div className="mb-4 flex items-center py-3">
          <h2 className=" mr-4 text-2xl font-bold">{"Profile"}</h2>
        </div>
        {/* text */}
        <div>
          <label htmlFor="nickname" className="mb-2 font-medium">
            Nickname
          </label>
          <input
            type="text"
            id="nickname"
            name="nickname"
            value={formData.nickname}
            onChange={handleSelectChange}
            className=" block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            required
          />
        </div>

        <div>
          <label htmlFor="nickname" className="mb-2 font-medium">
            Email
          </label>
          <input
            type="text"
            id="nickname"
            name="nickname"
            value={user?.email ?? ""}
            disabled
            onChange={handleSelectChange}
            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 disabled:bg-gray-50"
            required
          />
        </div>

        {/* single-select */}
        <div>
          <label htmlFor="gender" className="mb-2 font-medium">
            Gender
          </label>
          <select
            disabled
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleSelectChange}
            className="block w-full rounded-lg border border-gray-300 p-3 px-4 py-2 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 disabled:bg-gray-50"
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
          <label className="mb-2 font-medium text-gray-700">Match Gender</label>
          <div className="grid grid-cols-2 ">
            {matchGenderOptions.map((item) => (
              <div key={item.id} className="mb-2 mr-4 ">
                <label className="mb-2 flex items-center rounded-lg border border-gray-300 p-3">
                  <input
                    type="radio"
                    name="matchGender"
                    value={item.value}
                    checked={formData.matchGender === item.value}
                    onChange={handleSelectChange}
                    className="h-4 w-4 focus:ring-indigo-500"
                  />
                  <span className="ml-4 text-sm">{item.value}</span>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* select-radio */}
        <div>
          <label className="mb-2 font-medium text-gray-700">
            Relationship Status
          </label>
          <div className="grid grid-cols-2 ">
            {relationshipStatusOptions.map((item) => (
              <div key={item.id} className="mb-2 mr-4">
                <label className=" flex items-center rounded-lg border border-gray-300 p-3">
                  <input
                    type="radio"
                    name="relationshipStatus"
                    value={item.value}
                    checked={formData.relationshipStatus === item.value}
                    onChange={handleSelectChange}
                    className="h-4 w-4 focus:ring-indigo-500"
                  />
                  <span className="ml-4 text-sm">{item.value}</span>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* multi-checkbox */}
        <div>
          <label className="mb-2 font-medium text-gray-700">
            Expected Relationship
          </label>
          <div className="grid grid-cols-2">
            {expectedRelationshipOptions.map((item) => (
              <div key={item.id} className="mb-2 mr-4">
                <label className="mb-2 flex items-center rounded-lg border border-gray-300 p-3">
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
                  <span className="ml-4 text-sm">{item.value}</span>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* multi-checkbox */}
        <div>
          <label className="mb-2 font-medium text-gray-700">Interests</label>
          <div className="flex flex-wrap items-center justify-center">
            {interestOptions.map((item) => (
              <div key={item.id} className="mb-2 mr-4">
                <label className="mb-2 flex items-center rounded-lg border border-gray-300 px-3 py-2">
                  <input
                    type="checkbox"
                    name="interests"
                    value={item.value}
                    checked={formData.interests.includes(item.value)}
                    onChange={handleMultiSelectChange}
                    className="h-4 w-4 focus:ring-indigo-500"
                  />
                  <span className="ml-4 text-sm">{item.value}</span>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* file */}
        <div>
          <label className="mb-2 font-medium text-gray-700">Your Images</label>
          <ImageUploader
            user={user}
            imgUrlsObj={imgUrlsObj}
            onImageUpload={handleImageUpload}
            onImageDelete={handleImageDelete}
          ></ImageUploader>
        </div>
        {errorMsg && <p className="mb-2 text-sm text-red-500">{errorMsg}</p>}
        <div className="mt-2 text-center">
          <button type="submit" className="btn w-[50%]">
            Save
          </button>
        </div>
        {children}
      </form>
    </div>
  );
};

export default ProfileForm;
