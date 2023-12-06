import { UpdateGetStartFormData } from "./GetStartForm";

// interface UserCard extends UpdateGetStartFormData {
//   description: string;
// }

// interface CurrentUser extends UpdateGetStartFormData {
//   //   description: string;
//   uid: string;
//   friends: string[];
// }

interface MatchUser extends UpdateGetStartFormData {
  uid: string;
  friends: string[];
  description: string;
}

interface PotentialMatchData {
  users: string[];
  lastUpdatedOn?: Date;
  liked?: Boolean;
  userLiked?: string;
}

export { PotentialMatchData, MatchUser };
