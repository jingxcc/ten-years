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

const expectedRelationshipOptions = [
  "閒聊",
  "朋友",
  "交往",
  "結婚",
  "長久關係",
] as const;
type ExpectedRelationshipOptions = (typeof expectedRelationshipOptions)[number];

interface GetStartFormData {
  nickname: string;
  gender: GenderOptions;
  relationshipStatus: RelationshipStatus;
  expectedRelationships: ExpectedRelationshipOptions[];
  interest: string[];
  profilePicture: File[];
}

const GetStartForm: React.FC = () => {
  const [formData, setFormData] = useState<GetStartFormData>({
    nickname: "",
    gender: genderOptions[0],
    relationshipStatus: relationshipStatusOptions[0],
    expectedRelationships: [],
    interest: [],
    profilePicture: [],
  });

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
      setFormData({ ...formData, profilePicture: [...event.target.files] });
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    console.log(formData);
  };
  return (
    <div className="mx-auto mt-8 max-w-4xl">
      <form onSubmit={handleSubmit} className="mx-auto max-w-xl space-y-4">
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
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            required
          />
        </div>
        <div>
          <label htmlFor="gender" className="block text-sm font-medium">
            性別
          </label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleSelectChange}
            className="mt-1 block w-full rounded-md border-gray-300 px-4 py-2 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            required
          >
            {genderOptions.map((gender) => (
              <option key={gender} value={gender}>
                {gender}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            期望關係
          </label>
          <div className="mt-1">
            {expectedRelationshipOptions.map((relation) => (
              <label key={relation} className="mr-2 inline-flex items-center">
                <input
                  type="checkbox"
                  name="expectedRelationships"
                  value={relation}
                  checked={formData.expectedRelationships.includes(relation)}
                  onChange={handleMultiSelectChange}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-600">{relation}</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            個人圖片
          </label>
          <input
            type="file"
            onChange={handleFileChange}
            className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100"
          />
        </div>
        <button type="submit" className="btn">
          Submit
        </button>
      </form>
    </div>
  );
};

export default GetStartForm;
