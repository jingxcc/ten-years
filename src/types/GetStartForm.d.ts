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

// Options
interface FormOption {
  id: string;
  value: string;
}

export {
  UpdateGetStartFormData,
  GetStartFormData,
  FormOption,
  ProfileFormData,
};
