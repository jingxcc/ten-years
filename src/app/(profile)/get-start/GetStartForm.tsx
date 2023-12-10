import { storage } from "@/lib/firebase/initialize";
import { UserData } from "@/types/UserData";
import { GetStartFormData, ImageUrlsObj } from "@/types/GetStartForm";
import {
  genderOptions,
  relationshipStatusOptions,
  matchGenderOptions,
  expectedRelationshipOptions,
  interestOptions,
} from "@/constants/GetStartForm";

import {
  StorageError,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import updateGetStartFormDoc, {
  autoUpdateImageUrls,
} from "@/lib/firebase/firestore/updateGetStartFormDoc";
import ImageUploader from "@/components/ImageUploader/ImageUploader";
import toast from "react-hot-toast";
import fetchUserDoc from "@/lib/firebase/firestore/fetchUserDoc";

interface GetStartFormProps {
  user: UserData;
}

const GetStartForm: React.FC<GetStartFormProps> = ({ user }) => {
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
  });
  // const [storageUploadPercent, setStorageUploadPercent] = useState(0);
  const route = useRouter();
  const [imgUrlsObj, setImgUrlsObj] = useState<ImageUrlsObj[]>([]);

  useEffect(() => {
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
          fetchUpdateFormData?.gender ?? matchGenderOptions[0]["value"],
        expectedRelationships: fetchUpdateFormData?.expectedRelationships ?? [],
        interests: fetchUpdateFormData?.interests ?? [],
        imageUrls: fetchUpdateFormData?.imageUrls ?? [],
      };
      setFormData(fetchData);

      console.log("fetchFormData", fetchData);

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
        toast.success(`Welcome ! ${formData.nickname}`, { icon: "🎉🎉" });
        route.push("/chat");
      }
    } catch (error) {
      toast.error("Profile Created Failed");
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

    console.log("dataToUpdate upload", dataToUpdate);
  };

  // ImageUploader
  const handleImageDelete = (leftUrlsObj: ImageUrlsObj[]) => {
    let arrayToUpdate = leftUrlsObj.map((data) => data.url);
    autoUpdateImageUrls(user, arrayToUpdate);
    setFormData({ ...formData, imageUrls: arrayToUpdate });

    setImgUrlsObj(leftUrlsObj);
    console.log("leftUrlsObj delete", leftUrlsObj);
  };

  console.log("formData.imageUrls", formData.imageUrls);

  return (
    <div className="mx-auto mt-8 max-w-4xl rounded-xl border bg-white bg-opacity-95 p-10">
      <form onSubmit={handleSubmit} className="mx-auto max-w-xl space-y-4 ">
        <div className="mb-4 flex items-center justify-center py-3">
          <h2 className=" mr-4 text-2xl font-bold">{"Getting Start !"}</h2>
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
            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            required
          />
        </div>

        {/* single-select */}
        <div>
          <label htmlFor="gender" className="mb-2 font-medium">
            Gender
          </label>
          <select
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
              <div key={item.id} className="mb-2 mr-4">
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
          <div className="mb-2 grid grid-cols-2 ">
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
          <div className="mt-2 flex flex-wrap items-center">
            {expectedRelationshipOptions.map((item) => (
              <div key={item.id} className="mb-2 mr-4">
                <label className="mb-2 flex items-center rounded-lg border border-gray-300 px-3 py-2">
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
          <div className="flex flex-wrap items-center ">
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
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default GetStartForm;
