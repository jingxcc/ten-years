"use client";

import { firestore } from "@/lib/firebase/initialize";

import { useUser } from "@/context/userContext";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  QuerySnapshot,
  and,
  collection,
  doc,
  documentId,
  getDoc,
  onSnapshot,
  or,
  orderBy,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import fetchUserDoc from "@/lib/firebase/firestore/fetchUserDoc";
import Sidebar from "../../components/SideBar/SideBar";
import FriendList from "./FrendList";
import { ChatUser, Friend, MessageType } from "@/types/ChatPage";
import { createFriendDoc } from "@/lib/firebase/firestore/createFriendDoc";
import { UserData } from "@/types/UserData";
import Chat from "./Chat";
import fetchPotentialMatchDoc from "@/lib/firebase/firestore/fetchPotentialMatchDoc";
import fetchAllFriendDocIds from "@/lib/firebase/firestore/fetchFriendDoc";

// get matches doc
const fetchLikedMatch = async (user: UserData) => {
  const matchDocResult: string[] = await fetchAllFriendDocIds(user);

  return matchDocResult;

  // const friendsRef = collection(firestore, "users", user.uid, "friends");
  //   const querySnapShot = await getDocs(friendsRef);

  // get liked matches doc
  // const matchDocResult = await fetchPotentialMatchDoc(user);
  // if (!matchDocResult) {
  //   return false;
  // }
  // // tmp: 跳過按確認
  // console.log("matchDocResult", matchDocResult);
  // const likedMatchUId =
  //   matchDocResult && matchDocResult["userLiked"]
  //     ? matchDocResult["userLiked"]
  //     : "";
  // if (likedMatchUId) {
  //   await createFriendDoc(user.uid, {
  //     friendId: likedMatchUId,
  //     addedOn: new Date(),
  //   });
  //   await createFriendDoc(likedMatchUId, {
  //     friendId: user.uid,
  //     addedOn: new Date(),
  //   });
  //   console.log("likedMatchUId", likedMatchUId);
  //   return likedMatchUId;
  //   // setlikedMatch(likedMatchUId);
  //   // console.log("Like Match Doc Created");
  // }
};

// const mergeMessages = (
//   existingMessages: Message[],
//   newMessages: Message[],
// ): Message[] => {
//   const allMessages = [...existingMessages, ...newMessages].sort((a, b) => {
//     // Convert Firestore Timestamps to JavaScript Date objects, handling null cases
//     const dateA = a.timestamp?.toDate() ?? new Date(0); // Use toDate() for Firestore Timestamp
//     const dateB = b.timestamp?.toDate() ?? new Date(0);

//     return dateA.getTime() - dateB.getTime();
//   });
//   console.log("allMessages", allMessages);

//   // function sortCompareMessages(a, b) {
//   //   // messages.sort((a, b) => {
//   //   // Convert Firestore Timestamps to JavaScript Date objects
//   //   const dateA = a.timestamp ? a.timestamp.toDate() : new Date(0); // Fallback to epoch time if timestamp is null
//   //   const dateB = b.timestamp ? b.timestamp.toDate() : new Date(0);

//   //   // Compare the Date objects using getTime
//   //   return dateA.getTime() - dateB.getTime();
//   //   // });
//   // }

//   return allMessages;
//   // return allMessages.sort(
//   //   (a, b) => (a.timestamp?.getTime() ?? 0) - (b.timestamp?.getTime() ?? 0),
//   // );
// };

// const fetchFriendData = async (user, friendUIds) => {
//   const usersCollectionRef = collection(firestore, "users");
//   const usersQuery = query(
//     usersCollectionRef,
//     where(documentId(), "in", friendUIds),
//   );
//   const userDocs = await getDoc(usersQuery);

//   // Map over each document to create User objects
//   const friendsData = userDocs.docs.map(
//     (doc) => ({ ...doc.data() }) as ChatUser,
//   );
//   retu;
//   setFriends(friendsData);
// };

export default function ChatPage() {
  const { user, isUserLoading } = useUser();
  const [friends, setFriends] = useState<ChatUser[]>([]);
  const [currentUser, setCurrentUser] = useState<ChatUser | null>(null);
  const [currentRecipientUId, setCurrentRecipientUId] = useState<string>("");
  // const [likedMatch, setlikedMatch] = useState<string>("");
  const [likedMatches, setlikedMatches] = useState<string[]>([]);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [showChat, setShowChat] = useState<boolean>(false);
  const latestMessagesRef = useRef<MessageType[]>([]);

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
    const checkFriendDocExist = async () => {
      if (!user) {
        return false;
      }
      // tmp 邏輯需加強
      const fetchLikedMatchResult = await fetchLikedMatch(user);

      if (fetchLikedMatchResult) {
        setlikedMatches(fetchLikedMatchResult);
      }
    };
    const fetchUserData = checkFriendDocExist();
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
        // setFriendUIds(friendsData.map((data) => data.uid));
        console.log("friendsDocs", friendsDocs);

        if (friendsDocs.length === 0) return false;

        const friendUIds = friendsDocs.map((data) => data.uid);

        // tmp: move, fetchFriendData
        // const usersCollectionRef = collection(firestore, "users");
        // const usersQuery = query(
        //   usersCollectionRef,
        //   where(documentId(), "in", friendUIds),
        // );
        // const userDocs = await getDoc(usersQuery);

        // Map over each document to create User objects
        // const friendsData = userDocs.docs.map(
        //   (doc) => ({ ...doc.data() }) as ChatUser,
        // );

        // const friendPromises = friendUIds.map((id: string) => {
        //   const userRef = doc(firestore, "users", id);
        //   return getDoc(userRef);
        // });
        // const userDocs = await Promise.all(friendPromises);
        // // console.log("matchDocs", matchDocs);

        // console.log("userDocs", userDocs);

        // const friendsData = userDocs.map((doc) => ({
        //   ...(doc.data() as ChatUser),
        // }));

        // setFriends(friendsData);

        Promise.all(
          snapshot.docs.map((friendDoc) => {
            // Assume each friend document has a field 'friendId' that is the user's ID
            const friendId = friendDoc.data().friendId;
            return getDoc(doc(firestore, "users", friendId));
          }),
        )
          .then((userDocs) => {
            // Map over each document to create User objects
            const friendsData = userDocs.map((userDoc) => {
              return { ...userDoc.data() } as ChatUser;
            });
            setFriends(friendsData);
            setCurrentRecipientUId(friendsData[0]["uid"]);
          })
          .catch((error) => {
            console.error("Error fetching friend data:", error);
          });

        // console.log("friendsData", friendsData);
      });

      return () => unsubscribe();
    };

    fetchFriendData();
  }, [user, likedMatches]);

  useEffect(() => {
    if (user) {
      const messagesRef = collection(firestore, "messages");

      // const querySentMessages = query(
      //   messagesRef,
      //   where("fromUserId", "==", user.uid),
      //   where("toUserId", "==", currentRecipientUId),
      //   orderBy("timestamp", "desc"),
      // );

      // const queryReceivedMessages = query(
      //   messagesRef,
      //   where("fromUserId", "==", currentRecipientUId),
      //   where("toUserId", "==", user.uid),
      //   orderBy("timestamp", "desc"),
      // );

      // send and receive
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

      // const handleSnapshot = (
      //   snapshot: QuerySnapshot,
      //   type: "sent" | "received",
      // ) => {
      //   const newMessages = snapshot.docs.map((doc) => ({
      //     id: doc.id,
      //     ...(doc.data() as Message),
      //   }));
      //   latestMessagesRef.current =
      //     type === "sent"
      //       ? mergeMessages(latestMessagesRef.current, newMessages)
      //       : mergeMessages(newMessages, latestMessagesRef.current);
      //   setMessages([...latestMessagesRef.current]);
      // };

      // const unsubscribeSent = onSnapshot(querySentMessages, (snapshot) =>
      //   handleSnapshot(snapshot, "sent"),
      // );
      // const unsubscribeReceived = onSnapshot(
      //   queryReceivedMessages,
      //   (snapshot) => handleSnapshot(snapshot, "received"),
      // );

      const unsubscribe = onSnapshot(queryMessages, (snapshot) => {
        const newMessages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as MessageType),
        }));
        // .sort((a, b) => {
        //   // Convert Firestore Timestamps to JavaScript Date objects, handling null cases
        //   const dateA = a.timestamp?.toDate() ?? new Date(0); // Use toDate() for Firestore Timestamp
        //   const dateB = b.timestamp?.toDate() ?? new Date(0);

        //   return dateA.getTime() - dateB.getTime();
        // });

        setMessages(newMessages);
      });

      // const unsubscribeSent = onSnapshot(querySentMessages, (snapshot) => {
      //   const sentMessages = snapshot.docs.map((doc) => ({
      //     id: doc.id,
      //     ...(doc.data() as Message),
      //   }));
      //   setMessages((prevMessages) =>
      //     mergeMessages(prevMessages, sentMessages),
      //   );
      //   console.log(123);
      // });

      // const unsubscribeReceived = onSnapshot(
      //   queryReceivedMessages,
      //   (snapshot) => {
      //     const receivedMessages = snapshot.docs.map((doc) => ({
      //       id: doc.id,
      //       ...(doc.data() as Message),
      //     }));
      //     setMessages((prevMessages) =>
      //       mergeMessages(prevMessages, receivedMessages),
      //     );
      //     console.log(123);
      //   },
      // );

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

  // // tmp: useCallback? useMemo?
  // const handleNewMessage = (newMessage: MessageType) => {
  //   setMessages((prev) => [newMessage, ...prev]);
  //   console.log("是你 render?");
  // };

  if (!user || isUserLoading) {
    return (
      <div className="h-100dvh  w-screen text-center text-2xl font-bold text-sky-300 ">
        <h3 className="block py-[20%]"> Loading ...</h3>
      </div>
    );
  }
  console.log("showChat", showChat);

  return (
    <div className="h-100dvh relative ">
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
              // onNewMessage={handleNewMessage}
            />
          </div>
        </main>
      )}
    </div>
  );
}
