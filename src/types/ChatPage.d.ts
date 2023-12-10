import { UpdateGetStartFormData } from "./GetStartForm";

interface Friend {
  friendId: string;
  addedOn: Date | firebase.firestore.Timestamp;
}

interface MessageType {
  id?: string;
  text: string;
  fromUserId: string;
  toUserId: string;
  timestamp: firebase.firestore.Timestamp | null;
}

interface ChatUser extends UpdateGetStartFormData {
  uid: string;
  //   friends: string[];
  //   aboutMe: string;
}

export { Friend, MessageType, ChatUser };
