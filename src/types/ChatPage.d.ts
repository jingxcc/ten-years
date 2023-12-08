import { UpdateGetStartFormData } from "./GetStartForm";

interface Friend {
  friendId: string;
  addedOn: Date;
}

interface Message {
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

export { Friend, Message, ChatUser };
