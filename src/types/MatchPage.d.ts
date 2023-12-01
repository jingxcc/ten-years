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

interface MatchData {
  users: string[];
  matchOn: string;
  liked?: Boolean;
  likedUser?: string;

  //   status: "pending" | "active" | "finished";
}
