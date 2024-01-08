import { MessageType } from "@/types/ChatPage";
import { UserData } from "@/types/UserData";

interface MessageProps {
  message: MessageType;
  user: UserData;
}

const Message: React.FC<MessageProps> = ({ message, user }) => {
  console.log("render message");

  return (
    <li
      className={`my-2 max-w-[40%] break-words rounded-2xl border-none p-2 ${
        message.fromUserId === user.uid
          ? "ml-auto mr-2 bg-blue-300 text-white"
          : "ml-2 bg-gray-200"
      }`}
    >
      {message.text}
    </li>
  );
};

export default Message;
