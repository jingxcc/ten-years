import { convertFirestoreTimeStampToDate } from "@/lib/lib";
import { ChatUser, MessageType } from "@/types/ChatPage";
import { UserData } from "@/types/UserData";
import Image from "next/image";
import { memo } from "react";

interface MessageProps {
  currentRecipient: ChatUser;
  message: MessageType;
  user: UserData;
}

const Message: React.FC<MessageProps> = ({
  message,
  user,
  currentRecipient,
}) => {
  console.log("render message");

  return (
    <>
      <li
        className={`my-2 flex items-end gap-x-1 ${
          message.fromUserId === user.uid
            ? "justify-end pr-2"
            : "justify-start pl-2"
        }`}
      >
        {message.fromUserId !== user.uid && (
          <div className="relative mr-1 h-10 w-10 overflow-hidden  rounded-full">
            <Image
              src={
                currentRecipient["imageUrls"] &&
                currentRecipient["imageUrls"].length !== 0
                  ? currentRecipient["imageUrls"][0]
                  : "/defaultAvatar.jpg"
              }
              alt={`${
                currentRecipient?.nickname ?? currentRecipient.email
              }'s avatar`}
              width={80}
              height={80}
              className=" h-full w-full border-sky-300 bg-sky-100 object-cover object-center text-sky-300"
            />
          </div>
        )}
        <div
          className={`w-fit max-w-[60%] break-words rounded-2xl border-none px-3 py-2 ${
            message.fromUserId === user.uid
              ? "order-2 bg-blue-300 text-white"
              : "order-1 bg-gray-200"
          }`}
        >
          {message.text.split("\n").map((line, index) => (
            <span key={index}>
              {line}
              <br />
            </span>
          ))}
        </div>
        <span
          className={`text-xs text-neutral-300 ${
            message.fromUserId === user.uid ? "order-1" : "order-2"
          }`}
        >
          {convertFirestoreTimeStampToDate(message.timestamp, "HH:MM")}
        </span>
      </li>
    </>
  );
};

export default memo(Message);
