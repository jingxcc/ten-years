"use client";

import { useUser } from "../../../context/userContext";

import ProfileForm from "./ProfileForm";
import Sidebar from "@/components/SideBar/SideBar";

export default function ProfilePage() {
  const { user, isUserLoading } = useUser();

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
