import { UpdateGetStartFormData } from "./GetStartForm";

interface MatchUser extends UpdateGetStartFormData {
  uid: string;
  friends: string[];
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

export { PotentialMatchData, MatchUser, MatchRequestData };
