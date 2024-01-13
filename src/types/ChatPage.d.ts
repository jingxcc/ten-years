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
  timestamp: firebase.firestore.Timestamp | null | string;
}

type MessagesWithDate = MessageType | string;

interface ChatUser extends UpdateGetStartFormData {
  uid: string;
}

export { Friend, MessageType, ChatUser, MessagesWithDate };
