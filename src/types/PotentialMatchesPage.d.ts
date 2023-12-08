import { UpdateGetStartFormData } from "./GetStartForm";

// interface UserCard extends UpdateGetStartFormData {
//   aboutMe: string;
// }

// interface CurrentUser extends UpdateGetStartFormData {
//   //   aboutMe: string;
//   uid: string;
//   friends: string[];
// }

interface MatchUser extends UpdateGetStartFormData {
  uid: string;
  friends: string[];
}

interface PotentialUser extends UpdateGetStartFormData {
  uid: string;
  aboutMe?: string;
}

interface PotentialMatchData {
  users: string[];
  lastUpdatedOn?: Date | firebase.firestore.Timestamp;
  liked?: Boolean;
  userLiked?: string;
}

interface MatchRequestData {
  id?: string;
  fromUserId: string;
  toUserId: string;
  status: "sent" | "accepted" | "rejected";
  sendAt: firebase.firestore.Timestamp;
}

export { PotentialMatchData, MatchUser, PotentialUser, MatchRequestData };
