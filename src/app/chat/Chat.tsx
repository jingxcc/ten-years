import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { ChatUser, MessageType } from "@/types/ChatPage";
import { firestore } from "@/lib/firebase/initialize";
import { UserData } from "@/types/UserData";
import Message from "./Message";
import Image from "next/image";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";

interface Props {
  user: UserData;
  messages: MessageType[];
  // currentRecipientUId: string;
  currentRecipient: ChatUser | undefined;
  onBackToList: () => void;
  //   onNewMessage: (message: Message) => void;
}

const Chat: React.FC<Props> = ({
  user,
  messages,
  // currentRecipientUId,
  currentRecipient,
  onBackToList,
  //   onNewMessage,
}) => {
  const [newMessage, setNewMessage] = useState("");
  // const lastMessageRef = useRef(null);

  const handleEnterKey = async (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key == "Enter") {
      sendMessage();
    }
  };

  // console.log("currentRecipient", currentRecipient);

  // useEffect(() => {
  //   if (lastMessageRef.current) {
  //     lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
  //   }
  // }, [messages]);

  const handleSendMessage = async () => {
    sendMessage();
  };

  const sendMessage = async () => {
    if (currentRecipient && newMessage.trim() !== "") {
      const docRef = await addDoc(collection(firestore, "messages"), {
        text: newMessage,
        fromUserId: user.uid,
        toUserId: currentRecipient.uid,
        timestamp: serverTimestamp(),
      });

      const newMessageObj: MessageType = {
        id: docRef.id,
        text: newMessage,
        fromUserId: user.uid,
        toUserId: currentRecipient.uid,
        timestamp: null,
      };

      //   onNewMessage(newMessageObj);
      setNewMessage("");
    }
  };

  const handleClickBackToList = () => {
    onBackToList();
  };

  if (!currentRecipient) return null;

  return (
    <>
      <div className=" flex max-h-[72px] items-center border-b border-neutral-200 px-4 py-4">
        <button
          className="mr-3 items-center p-2 md:hidden"
          onClick={handleClickBackToList}
        >
          <ChevronLeftIcon className="h-5 w-5"></ChevronLeftIcon>
        </button>
        <div className="relative mr-3 h-10 w-10 overflow-hidden  rounded-full">
          <Image
            src={
              currentRecipient["imageUrls"] &&
              currentRecipient["imageUrls"].length !== 0
                ? currentRecipient["imageUrls"][0]
                : "/defaultAvatar.jpg"
            }
            alt={`${
              currentRecipient?.nickname ?? currentRecipient?.email
            }'s avatar`}
            width={80}
            height={80}
            className=" h-full w-full border-sky-300 bg-sky-100 object-cover object-center text-sky-300"
          />
        </div>
        <h2 className=" font-bold">
          {currentRecipient?.nickname ?? currentRecipient?.email}
        </h2>
      </div>
      <ul className=" overflow-y-auto pb-14">
        {messages.map((message, index) => (
          <Message key={message.id} user={user} message={message}></Message>
          // <li
          //   key={message.id}
          //   className={`my-2 max-w-[40%] rounded-2xl border-none p-2 ${
          //     message.fromUserId === user.uid
          //       ? "ml-auto mr-2 bg-blue-300 text-white"
          //       : "ml-2 bg-gray-200"
          //   }`}
          // >
          //   {message.text}
          // </li>
        ))}
      </ul>
      <div className="absolute bottom-0 left-0 flex w-full bg-white p-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleEnterKey}
          placeholder="Type a message"
          className=" rounded border border-gray-300 p-2"
        />
        <button onClick={handleSendMessage} className="btn ml-2">
          Send
        </button>
      </div>
    </>
  );
};

export default Chat;
