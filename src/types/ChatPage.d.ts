import { UpdateGetStartFormData } from "./GetStartForm";

interface Friend {
  friendId: string;
  addedOn: Date;
}

interface Message {
  text: string;
  fromUserId: string;
  toUserId: string;
  timestamp: Date;
}

interface ChatUser extends UpdateGetStartFormData {
  uid: string;
  //   friends: string[];
  //   description: string;
}

export { Friend, Message, ChatUser };
