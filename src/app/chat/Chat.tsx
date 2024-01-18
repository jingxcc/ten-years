import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { ChatUser, MessageType, MessagesWithDate } from "@/types/ChatPage";
import { firestore } from "@/lib/firebase/initialize";
import { UserData } from "@/types/UserData";
import Message from "./Message";
import Image from "next/image";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { isMobile } from "react-device-detect";

interface Props {
  user: UserData;
  messages: MessagesWithDate[];
  currentRecipient: ChatUser | undefined;
  onBackToList: () => void;
}

const Chat: React.FC<Props> = ({
  user,
  messages,
  currentRecipient,
  onBackToList,
}) => {
  const [newMessage, setNewMessage] = useState("");
  const chatEndRef = useRef<null | HTMLDivElement>(null);
  const messageContainerRef = useRef<null | HTMLDivElement>(null);

  // console.log("Chat");

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleEnterKey = async (
    event: React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if (event.key === "Enter" && !event.shiftKey && !isMobile) {
      sendMessage();
    }
  };

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

      setNewMessage("");
    }
  };

  const handleClickBackToList = () => {
    onBackToList();
  };

  if (!currentRecipient) return null;

  return (
    <>
      <div className=" flex max-h-[72px] items-center border-b border-neutral-200 px-4 py-2">
        <button
          className="mr-3 items-center p-2 md:hidden"
          onClick={handleClickBackToList}
        >
          <ChevronLeftIcon className="h-5 w-5"></ChevronLeftIcon>
        </button>
        <div className="relative mr-3 h-12 w-12 overflow-hidden  rounded-full">
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
            width={100}
            height={100}
            className=" h-full w-full border-sky-300 bg-sky-100 object-cover object-center text-sky-300"
          />
        </div>
        <h2 className=" font-bold">
          {currentRecipient?.nickname ?? currentRecipient.email}
        </h2>
      </div>

      <div className=" flex-grow overflow-y-auto" ref={messageContainerRef}>
        <ul className="">
          {messages.map((message, index) =>
            typeof message !== "string" ? (
              <Message
                key={message.id}
                user={user}
                message={message}
                currentRecipient={currentRecipient}
              ></Message>
            ) : (
              <div
                key={message}
                className="my-6 text-center text-xs text-neutral-500"
              >
                <span className="rounded-full bg-sky-50 px-4 py-1">
                  {message}
                </span>
              </div>
            ),
          )}
        </ul>
        <div ref={chatEndRef} className="h-0 w-0"></div>
      </div>
      <div className="flex w-full border-t border-gray-300 bg-white p-2">
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Shift + Enter for a new line"
          onKeyDown={handleEnterKey}
          rows={1}
          className="flex-grow resize-none p-2 focus:outline-none"
        />
        <button onClick={handleSendMessage} className="btn ml-2 rounded">
          Send
        </button>
      </div>
    </>
  );
};

export default Chat;
