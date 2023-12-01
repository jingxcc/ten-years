// Form Data
interface UpdateGetStartFormData extends GetStartFormData {
  isStartProfileCompleted: boolean;
  uid?: string;
  friends?: string[];
  description?: string;
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

// Options
interface FormOption {
  id: string;
  value: string;
}

export { UpdateGetStartFormData, GetStartFormData, FormOption };
