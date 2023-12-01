"use client";

import { auth, firestore } from "@/lib/firebase/initialize";
import { FirebaseError } from "firebase/app";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

import { useUser } from "@/context/userContext";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import fetchUserDoc from "@/lib/firebase/firestore/fetchUserDoc";
import Sidebar from "../../components/SideBar/SideBar";

export default function ChatPage() {
  const { user, isUserLoading } = useUser();
  // const { userData, setUserData } = useState({});
  const route = useRouter();

  const router = useRouter();
  useEffect(() => {
    if (!isUserLoading && !user) {
      route.push("/");
    }
  }, [isUserLoading, user, route]);

  // if (!user) {
  //   alert("No user data provided");
  //   return false;
  // }
  useEffect(() => {
    if (user) {
      fetchUserDoc(user);
    }
  }, [user]);

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
        {/* <h3 className="text-lg">{userData.nickname}</h3> */}
        {/* <p>chat page</p> */}
      </main>
    </div>
  );
}
