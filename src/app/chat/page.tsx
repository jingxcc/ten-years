"use client";

import { firestore } from "@/lib/firebase/initialize";
import { useUser } from "@/context/userContext";
import { useEffect, useState } from "react";
import {
  and,
  collection,
  doc,
  getDoc,
  onSnapshot,
  or,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import fetchUserDoc from "@/lib/firebase/firestore/fetchUserDoc";
import Sidebar from "../../components/SideBar/SideBar";
import FriendList from "./FrendList";
import { ChatUser, MessageType } from "@/types/ChatPage";
import Chat from "./Chat";

export default function ChatPage() {
  const { user, isUserLoading } = useUser();
  const [friends, setFriends] = useState<ChatUser[]>([]);
  const [currentUser, setCurrentUser] = useState<ChatUser | null>(null);
  const [currentRecipientUId, setCurrentRecipientUId] = useState<string>("");
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [showChat, setShowChat] = useState<boolean>(false);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!user) {
        return false;
      }
      const fetchUserDocResult = await fetchUserDoc(user);

      if (fetchUserDocResult) {
        setCurrentUser({ ...(fetchUserDocResult["data"] as ChatUser) });
      }
    };
    fetchCurrentUser();
  }, [user]);

  useEffect(() => {
    const fetchFriendData = async () => {
      if (!user) {
        return false;
      }

      const friendsQuery = query(
        collection(firestore, `/users/${user.uid}/friends`),
      );
      const unsubscribe = onSnapshot(friendsQuery, async (snapshot) => {
        const friendsDocs = snapshot.docs.map((doc) => doc.data() as ChatUser);

        if (friendsDocs.length === 0) return false;

        const friendUIds = friendsDocs.map((data) => data.uid);

        Promise.all(
          snapshot.docs.map((friendDoc) => {
            const friendId = friendDoc.data().friendId;
            return getDoc(doc(firestore, "users", friendId));
          }),
        )
          .then((userDocs) => {
            const friendsData = userDocs.map((userDoc) => {
              return { ...userDoc.data() } as ChatUser;
            });
            setFriends(friendsData);
            setCurrentRecipientUId(friendsData[0]["uid"]);
          })
          .catch((error) => {
            console.error("Error fetching friend data:", error);
          });
      });

      return () => unsubscribe();
    };

    fetchFriendData();
  }, [user]);

  useEffect(() => {
    if (user) {
      // send and receive
      const messagesRef = collection(firestore, "messages");
      const queryMessages = query(
        messagesRef,
        or(
          and(
            where("fromUserId", "==", user.uid),
            where("toUserId", "==", currentRecipientUId),
          ),
          and(
            where("fromUserId", "==", currentRecipientUId),
            where("toUserId", "==", user.uid),
          ),
        ),
        orderBy("timestamp", "asc"),
      );

      const unsubscribe = onSnapshot(queryMessages, (snapshot) => {
        const newMessages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as MessageType),
        }));

        setMessages(newMessages);
      });

      return () => {
        unsubscribe();
      };
    }
  }, [user, currentRecipientUId]);

  const handleClickRecipient = (recipientUId: string) => {
    setCurrentRecipientUId(recipientUId);
    setShowChat(true);
  };

  const handleBackToList = () => {
    setShowChat(false);
  };

  if (!user || isUserLoading) {
    return (
      <div className="h-100dvh  w-screen text-center text-2xl font-bold text-sky-300 ">
        <h3 className="block py-[20%]"> Loading ...</h3>
      </div>
    );
  }

  return (
    <div className="relative h-100dvh ">
      <div className={`${showChat && "hidden xs:block"}`}>
        <Sidebar user={user}></Sidebar>
      </div>
      {currentUser && (
        <main className="relative h-full xs:ml-20  md:flex">
          <div className={`friend-list md:animate-none`}>
            <FriendList
              friends={friends}
              currentUser={currentUser}
              onClickRecipient={handleClickRecipient}
            />
          </div>
          <div
            className={`${
              showChat ? "absolute left-0 top-0 animate-slide-in" : "hidden "
            } chat z-40 md:relative md:z-0 md:animate-none`}
          >
            <Chat
              key={currentRecipientUId}
              user={user}
              messages={messages}
              currentRecipient={friends.find(
                (friend) => friend.uid === currentRecipientUId,
              )}
              onBackToList={handleBackToList}
            />
          </div>
        </main>
      )}
    </div>
  );
}
