"use client";

import { useRouter } from "next/navigation";
import { useUser } from "./userContext";
import { useEffect, useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { firestore } from "@/lib/firebase/initialize";
import { UserData } from "@/types/UserData";

const addUserDocument = async (user: UserData | null) => {
  if (!user) {
    alert("No user data provided");
    return false;
  }
  const data = { uid: user.uid, email: user?.email };

  try {
    await setDoc(doc(firestore, "users", user.uid), data);
    console.log("set document");

    return true;
  } catch (error) {
    if (error instanceof Error) {
      alert(error.message);
    } else {
      alert(error);
    }
    return false;
  }
};

export default function profileSetUpPage() {
  const [isDocAdded, setIsDocAdded] = useState<boolean>(false);
  const { user, isUserLoading } = useUser();
  const route = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      route.push("/");
    }
    const checkAddUserDocument = async () => {
      if (!isDocAdded && user) {
        const result = await addUserDocument(user);

        if (result) {
          setIsDocAdded(true);
        }
      }
    };
    checkAddUserDocument();
  }, [isUserLoading]);

  // console.log("Loading", isUserLoading);
  console.log("user", user);

  // if (isUserLoading) {
  //   return <div>Loading...</div>;
  // }

  return (
    <div>
      <p>profile set-up page</p>
    </div>
  );
}
