import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { MessageType } from "@/types/ChatPage";
import { firestore } from "@/lib/firebase/initialize";
import { UserData } from "@/types/UserData";
import Message from "./Message";

interface Props {
  user: UserData;
  messages: MessageType[];
  currentRecipientUId: string;
  //   onNewMessage: (message: Message) => void;
}

const Chat: React.FC<Props> = ({
  user,
  messages,
  currentRecipientUId,
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

  // useEffect(() => {
  //   if (lastMessageRef.current) {
  //     lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
  //   }
  // }, [messages]);

  const handleSendMessage = async () => {
    sendMessage();
  };

  const sendMessage = async () => {
    if (newMessage.trim() !== "") {
      const docRef = await addDoc(collection(firestore, "messages"), {
        text: newMessage,
        fromUserId: user.uid,
        toUserId: currentRecipientUId,
        timestamp: serverTimestamp(),
      });

      const newMessageObj: MessageType = {
        id: docRef.id,
        text: newMessage,
        fromUserId: user.uid,
        toUserId: currentRecipientUId,
        timestamp: null,
      };

      //   onNewMessage(newMessageObj);
      setNewMessage("");
    }
  };

  return (
    <div className="flex h-full flex-1 flex-col">
      <ul className="flex-1 overflow-y-auto">
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
      <div className="flex p-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleEnterKey}
          placeholder="Type a message"
          className="flex-1 rounded border border-gray-300 p-2"
        />
        <button onClick={handleSendMessage} className="btn ml-2">
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
