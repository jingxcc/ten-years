"use client";

import { auth } from "@/lib/firebase/initialize";
import { FirebaseError } from "firebase/app";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import Sidebar from "./SideBar";
import { useUser } from "@/context/userContext";
import { useEffect } from "react";

export default function ChatPage() {
  const { user, isUserLoading } = useUser();
  const route = useRouter();

  const router = useRouter();
  useEffect(() => {
    if (!isUserLoading && !user) {
      route.push("/");
    }
  }, [isUserLoading, user, route]);

  const handleSignOut = async () => {
    console.log("sign out");
    try {
      await signOut(auth);
      alert("Logout success");
      router.push("/");
    } catch (error) {
      if (error instanceof FirebaseError) {
        // const errorCode = error.code;
        // const errorMessage = error.message;
        // const errorMessage = getAuthErrorMsg(error);
        alert(`Logout Error: ${error.message}`);
      } else {
        alert(`Logout Error: ${error}`);
      }
    }
  };

  return (
    <div>
      <Sidebar>
        <button className="btn" onClick={handleSignOut}>
          Log out
        </button>
        {/* <button className="btn mt-2" onClick={() => router.push("/get-start")}>
          {"start (test)"}
        </button> */}
      </Sidebar>
      <main className="ml-32 px-2">{/* <p>chat page</p> */}</main>
    </div>
  );
}
