// import { useState, useEffect } from "react";
// import {
//   collection,
//   addDoc,
//   query,
//   orderBy,
//   onSnapshot,
// } from "firebase/firestore";
// import { firestore } from "@/lib/firebase/initialize";
// import { Message } from "@/types/ChatPage";

// const Chat = () => {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [newMessage, setNewMessage] = useState("");

//   // Firestore = real-time
//   useEffect(() => {
//     const messagesQuery = query(
//       collection(firestore, "messages"),
//       orderBy("timestamp"),
//     );
//     const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
//       const messagesData = snapshot.docs.map((doc) => ({
//         ...doc.data(),
//         id: doc.id,
//       }));
//       setMessages(messagesData);
//     });

//     return unsubscribe;
//   }, []);

//   // send a message
//   const sendMessage = async () => {
//     if (newMessage.trim() !== "") {
//       await addDoc(collection(firestore, "messages"), {
//         text: newMessage,
//         timestamp: new Date(),
//       });
//       setNewMessage(""); // Clear the input after sending
//     }
//   };

//   return (
//     <div className="chat-container">
//       <ul className="messages-list">
//         {messages.map((message) => (
//           <li key={message.id}>{message.text}</li>
//         ))}
//       </ul>
//       <input
//         type="text"
//         value={newMessage}
//         onChange={(e) => setNewMessage(e.target.value)}
//         placeholder="Type a message"
//         className="message-input"
//       />
//       <button onClick={sendMessage} className="send-message-button">
//         Send
//       </button>
//     </div>
//   );
// };

// export default Chat;
