import React, { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { Message } from "@/types/ChatPage";
import { firestore } from "@/lib/firebase/initialize";
import { UserData } from "@/types/UserData";

interface Props {
  user: UserData | null;
  messages: Message[];
  currentRecipientUId: string;
  onNewMessage: (message: Message) => void;
}

const Chat: React.FC<Props> = ({
  user,
  messages,
  currentRecipientUId,
  onNewMessage,
}) => {
  const [newMessage, setNewMessage] = useState("");
  if (!user) {
    return null;
  }

  const handleSendMessage = async () => {
    if (newMessage.trim() !== "") {
      const docRef = await addDoc(collection(firestore, "messages"), {
        text: newMessage,
        fromUserId: user.uid,
        toUserId: currentRecipientUId,
        timestamp: serverTimestamp(),
      });

      const newMessageObj: Message = {
        id: docRef.id,
        text: newMessage,
        fromUserId: user.uid,
        toUserId: currentRecipientUId,
        timestamp: null,
      };
      console.log();

      onNewMessage(newMessageObj);
      setNewMessage("");
    }
  };

  return (
    <div className="flex h-full flex-1 flex-col">
      <ul className="flex-1 overflow-y-auto">
        {messages.map((message) => (
          <li
            key={message.id}
            className={`my-2 max-w-[40%] rounded-2xl border-none p-2 ${
              message.fromUserId === user.uid
                ? "ml-auto mr-2 bg-blue-300 text-white"
                : "ml-2 bg-gray-200"
            }`}
          >
            {message.text}
          </li>
        ))}
      </ul>
      <div className="flex p-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
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
