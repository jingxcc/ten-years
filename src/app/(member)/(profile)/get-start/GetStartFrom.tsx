import { firestore, storage } from "@/lib/firebase/initialize";
import { UserData } from "@/types/UserData";
import { FirebaseError } from "firebase/app";
import { doc, updateDoc } from "firebase/firestore";
import {
  StorageError,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";

const genderOptions = ["男性", "女性"] as const;
type GenderOptions = (typeof genderOptions)[number];

const relationshipStatusOptions = [
  "單身",
  "交往中",
  "已婚",
  "剛分手",
  "一言難盡",
] as const;
type RelationshipStatus = (typeof relationshipStatusOptions)[number];

const matchgGenderOptions = ["男性", "女性", "都可以"] as const;
type MatchGenderOptions = (typeof matchgGenderOptions)[number];

const expectedRelationshipOptions = [
  "閒聊",
  "朋友",
  "交往",
  "結婚",
  "長久關係",
] as const;
type ExpectedRelationshipOptions = (typeof expectedRelationshipOptions)[number];

const interestOptions = [
  "聊天",
  "聽音樂",
  "唱歌",
  "踏青",
  "逛街",
  "玩遊戲",
  "畫畫",
  "看展覽",
  "旅遊",
  "健身",
] as const;
type InterestOptions = (typeof interestOptions)[number];

interface GetStartFormData {
  // isStartProfileCompleted: boolean;
  nickname: string;
  gender: GenderOptions;
  relationshipStatus: RelationshipStatus;
  matchGender: MatchGenderOptions;
  expectedRelationships: ExpectedRelationshipOptions[];
  interests: InterestOptions[];
  imageUrls: string[];
  // profilePictures: File[];
}
interface GetStartFormProps {
  user: UserData | null;
}

const GetStartForm: React.FC<GetStartFormProps> = ({ user }) => {
  if (!user) {
    return null;
  }

  const [imgFiles, setImgFiles] = useState<File[]>([]);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [formData, setFormData] = useState<GetStartFormData>({
    // isStartProfileCompleted: false,
    nickname: "",
    gender: genderOptions[0],
    relationshipStatus: relationshipStatusOptions[0],
    matchGender: matchgGenderOptions[0],
    expectedRelationships: [],
    interests: [],
    imageUrls: [],
    // imageUrls: ["/team04.jpeg", "/team03.jpg", "/team01.jpeg", "/team02.webbp"],
  });

  const route = useRouter();

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
      console.log("--> Upload img start:", file);
      uploadImage(file);
      // console.log(...event.target.files);
    }
    function uploadImage(img: File) {
      const imageMetadata = {
        contentType: "image/jpeg",
      };
      const storageRef = ref(storage, `users/${user?.uid}/${img.name}`);
      const uploadTask = uploadBytesResumable(storageRef, img, imageMetadata);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
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
        (error: StorageError) => {
          // error handle
          // console.log(`Image Upload Error: ${error.code}`);
          if (error instanceof StorageError) {
            // const errorCode = error.code;
            // const errorMessage = error.message;
            // const errorMessage = getAuthErrorMsg(error);
            setErrorMsg(error.message);
          } else {
            alert(`Image Upload Error: ${error}`);
          }
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            console.log("你有沒有進來????");

            console.log("() image", img);
            console.log("() url", downloadUrl);

            setImgFiles([...imgFiles, img]);
            setFormData({
              ...formData,
              imageUrls: [...formData.imageUrls, downloadUrl],
            });
          });
        },
      );
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const userRef = doc(firestore, "users", user.uid);

    try {
      const dataToUpdate = { ...formData };
      await updateDoc(userRef, dataToUpdate);
      alert("個人資料設定成功");
      route.push("/chat");
    } catch (error) {
      if (error instanceof FirebaseError) {
        // const errorCode = error.code;
        // const errorMessage = error.message;
        // const errorMessage = getAuthErrorMsg(error);
        setErrorMsg(error.message);
      } else {
        alert(`Submit Error: ${error}`);
      }
    }

    console.log(formData);
  };
  console.log("formData.imageUrls", formData.imageUrls);
  console.log("imgFiles", imgFiles);

  return (
    <div className="mx-auto mb-4 mt-8 max-w-4xl">
      <form onSubmit={handleSubmit} className="mx-auto max-w-xl space-y-4">
        {/* text */}
        <div>
          <label htmlFor="nickname" className="block text-sm font-medium">
            暱稱
          </label>
          <input
            type="text"
            id="nickname"
            name="nickname"
            value={formData.nickname}
            onChange={handleSelectChange}
            className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            required
          />
        </div>

        {/* single-select */}
        <div>
          <label htmlFor="gender" className="block text-sm font-medium">
            性別
          </label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleSelectChange}
            className="mt-2 block w-full rounded-md border-gray-300 px-4 py-2 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            required
          >
            {genderOptions.map((gender) => (
              <option key={gender} value={gender}>
                {gender}
              </option>
            ))}
          </select>
        </div>

        {/* select-radio */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            配對性別
          </label>
          <div className="mt-2 flex flex-wrap items-center">
            {matchgGenderOptions.map((item) => (
              <div className="mb-2 mr-4">
                <label
                  key={item}
                  className=" flex items-center rounded border border-gray-300 p-2"
                >
                  <input
                    type="radio"
                    name="matchGender"
                    value={item}
                    checked={formData.matchGender === item}
                    onChange={handleSelectChange}
                    className="h-4 w-4 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm">{item}</span>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* select-radio */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            感情狀況
          </label>
          <div className="mt-2 flex flex-wrap items-center">
            {relationshipStatusOptions.map((item) => (
              <div className="mb-2 mr-4">
                <label
                  key={item}
                  className=" flex items-center rounded border border-gray-300 p-2"
                >
                  <input
                    type="radio"
                    name="relationshipStatus"
                    value={item}
                    checked={formData.relationshipStatus === item}
                    onChange={handleSelectChange}
                    className="h-4 w-4 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm">{item}</span>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* multi-checkbox */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            期望關係
          </label>
          <div className="mt-2 flex flex-wrap items-center">
            {expectedRelationshipOptions.map((item) => (
              <div className="mb-2 mr-4">
                <label
                  key={item}
                  className="flex items-center rounded border border-gray-300 p-2"
                >
                  <input
                    type="checkbox"
                    name="expectedRelationships"
                    value={item}
                    checked={formData.expectedRelationships.includes(item)}
                    onChange={handleMultiSelectChange}
                    className="h-4 w-4 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm">{item}</span>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* multi-checkbox */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            興趣
          </label>
          <div className="mt-2 flex flex-wrap items-center justify-center">
            {interestOptions.map((item) => (
              <div className="mb-2 mr-4">
                <label
                  key={item}
                  className="flex items-center rounded border border-gray-300 p-2"
                >
                  <input
                    type="checkbox"
                    name="interests"
                    value={item}
                    checked={formData.interests.includes(item)}
                    onChange={handleMultiSelectChange}
                    className="h-4 w-4 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm">{item}</span>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* file */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            個人圖片
          </label>

          <div className="mt-2 flex items-center justify-start space-x-4">
            <label className="flex h-32 w-32 cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-gray-300">
              <input
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />
              <span className="text-gray-500">+</span>
            </label>

            {/* {formData.imageUrls.map((url, index) => (
              <div key={index} className="relative h-32 w-32">
                <Image
                  src={url}
                  alt="Uploaded picture"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-md"
                />
              </div>
            ))} */}

            {formData.imageUrls.length > 0 && (
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
            )}
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
