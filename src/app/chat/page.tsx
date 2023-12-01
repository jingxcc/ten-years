"use client";

import { auth, firestore } from "@/lib/firebase/initialize";
import { FirebaseError } from "firebase/app";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

import { useUser } from "@/context/userContext";
import { useEffect, useState } from "react";
import {
  collection,
  doc,
  documentId,
  getDoc,
  onSnapshot,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import fetchUserDoc from "@/lib/firebase/firestore/fetchUserDoc";
import Sidebar from "../../components/SideBar/SideBar";
import FriendList from "./FrendList";
import { ChatUser, Friend } from "@/types/ChatPage";
import fetchMatchDoc from "@/lib/firebase/firestore/fetchMatchDoc";
import { createFriendDoc } from "@/lib/firebase/firestore/createFriendDoc";
import { UserData } from "@/types/UserData";

// get matches doc
const fetchLikedMatch = async (user: UserData) => {
  // get liked matches doc
  const matchDocResult = await fetchMatchDoc(user);
  if (!matchDocResult) {
    return false;
  }
  // tmp: 跳過按確認
  console.log("matchDocResult", matchDocResult);
  const likedMatchUId =
    matchDocResult && matchDocResult["likedUser"]
      ? matchDocResult["likedUser"]
      : "";

  if (likedMatchUId) {
    await createFriendDoc(user.uid, {
      friendId: likedMatchUId,
      addedOn: new Date(),
    });
    console.log("likedMatchUId", likedMatchUId);
    return likedMatchUId;

    // setlikedMatch(likedMatchUId);
    // console.log("Like Match Doc Created");
  }
};

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
  // const [friendUIds, setFriendUIds] = useState<string[]>([]);
  const [likedMatch, setlikedMatch] = useState<string>("");
  // const { userData, setUserData } = useState({});
  const route = useRouter();

  const router = useRouter();
  useEffect(() => {
    if (!isUserLoading && !user) {
      route.push("/");
    }
  }, [isUserLoading, user, route]);

  useEffect(() => {
    const checkFriendDocExist = async () => {
      if (!user) {
        return false;
      }
      // tmp 邏輯需加強
      const addLikedMatchResult = await fetchLikedMatch(user);

      if (addLikedMatchResult) {
        setlikedMatch(addLikedMatchResult);
      }
    };

    checkFriendDocExist();
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
          })
          .catch((error) => {
            console.error("Error fetching friend data:", error);
          });

        // console.log("friendsData", friendsData);
      });

      return () => unsubscribe();
    };

    fetchFriendData();
  }, [user, likedMatch]);

  // useEffect(() => {
  //   console.log("friendUIds", friendUIds);
  // }, [friendUIds]);

  console.log("friend", friends);

  // const fetchUserData = async () => {
  //   if (!user) {
  //     alert("No user data provided");
  //     return false;
  //   }
  //   const userRef = doc(firestore, "users", user?.uid);
  //   const docSnap = await getDoc(userRef);
  //   try {
  //     if (docSnap.exists()) {
  //       console.log("Document data:", docSnap.data());
  //       // setUserData({
  //       //   ...userData,
  //       //   nickname: userData.nickname,
  //       //   imgUrl: userData["imageUrls"][0],
  //       // });
  //     } else {
  //       // docSnap.data() will be undefined in this case
  //       console.log("No such document!");
  //     }
  //   } catch (e) {
  //     console.log("Error getting cached document:", e);
  //   }
  // };

  console.log("user", user);
  if (isUserLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Sidebar>
        {/* <button className="btn mt-2" onClick={() => router.push("/get-start")}>
          {"start (test)"}
        </button> */}
      </Sidebar>
      <main className="ml-32 px-2">
        <FriendList friends={friends} />
        {/* <h3 className="text-lg">{userData.nickname}</h3> */}
        {/* <p>chat page</p> */}
      </main>
    </div>
  );
}
