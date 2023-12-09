// Form Data
interface UpdateGetStartFormData extends GetStartFormData {
  isStartProfileCompleted: boolean;
  uid?: string;
  email?: string;
  friends?: string[];
  aboutMe?: string;
}

interface GetStartFormData {
  nickname: string;
  gender: string;
  relationshipStatus: string;
  matchGender: string;
  expectedRelationships: string[];
  interests: string[];
  imageUrls: string[];
}

interface FormOption {
  id: string;
  value: string;
}

interface ProfileFormData {
  nickname: string;
  gender: string;
  relationshipStatus: string;
  matchGender: string;
  expectedRelationships: string[];
  interests: string[];
  imageUrls: string[];
  uid?: string;
  aboutMe?: string;
}

interface ImageUrlsObj {
  id: number;
  url: string;
}

export {
  UpdateGetStartFormData,
  GetStartFormData,
  FormOption,
  ProfileFormData,
  ImageUrlsObj,
};
