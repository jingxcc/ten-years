import { UpdateGetStartFormData } from "./GetStartForm";

export interface UserData {
  email: string | null;
  uid: string;
}

export interface UserDetails extends UpdateGetStartFormData {
  uid: string;
  aboutMe?: string;
}
