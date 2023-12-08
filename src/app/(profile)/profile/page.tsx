"use client";

import { useRouter } from "next/navigation";
import { useUser } from "../../../context/userContext";
import { useEffect } from "react";

import ProfileForm from "./ProfileForm";
import Sidebar from "@/components/SideBar/SideBar";

export default function profilePage() {
  const { user, isUserLoading } = useUser();
  const route = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      route.push("/");
    }
  }, [isUserLoading, user, route]);

  // console.log("Loading", isUserLoading);
  console.log("user", user);

  if (isUserLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="absolute h-full w-full">
      <Sidebar></Sidebar>
      <main className="ml-32 flex h-full">
        <ProfileForm user={user}></ProfileForm>
      </main>
    </div>
  );
}
