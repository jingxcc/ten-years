"use client";

import { useUser } from "../../../context/userContext";

import ProfileForm from "./ProfileForm";
import Sidebar from "@/components/SideBar/SideBar";

export default function ProfilePage() {
  const { user, isUserLoading } = useUser();

  // console.log("Loading", isUserLoading);

  if (!user || isUserLoading) {
    return (
      <div className="h-screen  w-screen text-center text-2xl font-bold text-sky-300 ">
        <h3 className="block py-[20%]"> Loading ...</h3>
      </div>
    );
  }

  return (
    <div className="relative">
      <Sidebar></Sidebar>
      <main className="ml-20 flex h-full">
        <ProfileForm user={user}></ProfileForm>
      </main>
    </div>
  );
}
