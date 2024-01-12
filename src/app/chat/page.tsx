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

interface ChatPageLoading {
  currentUser: boolean;
  friends: boolean;
  messages: boolean;
}

export default function ChatPage() {
  const { user, isUserLoading } = useUser();
  const [friends, setFriends] = useState<ChatUser[]>([]);
  const [currentUser, setCurrentUser] = useState<ChatUser | null>(null);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [currentRecipientUId, setCurrentRecipientUId] = useState<string>("");
  const [showChat, setShowChat] = useState<boolean>(false);
  const [loadingStates, setLoadingStates] = useState<ChatPageLoading>({
    currentUser: true,
    friends: true,
    messages: true,
  });

  useEffect(() => {
    fetchCurrentUser();
    fetchFriendData();
    console.log("use effect");
  }, [user]);

  // improve: if ChatRoom then maybe
  useEffect(() => {
    if (user && currentRecipientUId) {
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
        setLoadingStates({ ...loadingStates, messages: false });
        console.log("set message loading to false");
      });

      return () => {
        unsubscribe();
      };
    }
  }, [user, currentRecipientUId]);

  const fetchCurrentUser = async () => {
    if (!user) {
      return false;
    }
    const fetchUserDocResult = await fetchUserDoc(user);

    if (fetchUserDocResult) {
      setCurrentUser({ ...(fetchUserDocResult["data"] as ChatUser) });
      setLoadingStates({ ...loadingStates, currentUser: false });
      console.log("set currentUser loading to false");
    }
  };

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
        })
        .catch((error) => {
          console.error("Error fetching friend data:", error);
        })
        .finally(() => {
          setLoadingStates({ ...loadingStates, friends: false });
          console.log("set friends loading to false");
        });
    });

    return () => unsubscribe();
  };

  const handleClickRecipient = (recipientUId: string) => {
    setLoadingStates({ ...loadingStates, messages: true });

    console.log("set message loading to true");
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
      <main className="relative h-full xs:ml-20  md:flex">
        <div className={`friend-list md:animate-none`}>
          {currentUser && !loadingStates.friends ? (
            <FriendList
              friends={friends}
              currentUser={currentUser}
              onClickRecipient={handleClickRecipient}
            />
          ) : (
            <div className={`p-4 text-center font-semibold text-gray-400 `}>
              <p className="pt-6">{"Loading"}</p>
            </div>
          )}
        </div>
        <div
          className={`${
            showChat
              ? "absolute left-0 top-0 animate-slide-in"
              : "hidden md:block"
          } chat z-40 md:relative md:z-0 md:animate-none`}
        >
          {currentUser && currentRecipientUId ? (
            <Chat
              key={currentRecipientUId}
              user={user}
              messages={messages}
              currentRecipient={friends.find(
                (friend) => friend.uid === currentRecipientUId,
              )}
              onBackToList={handleBackToList}
            />
          ) : (
            <div
              className={`flex h-[80%] flex-col items-center justify-center gap-y-2 p-4 text-gray-400 `}
            >
              <p className="text-lg font-semibold text-gray-500">
                {"Your messages"}
              </p>
              <p>{"Send messages to a match"}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
