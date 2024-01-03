"use client";

import Header from "@/components/Header/Header";
import { useUser } from "../../../context/userContext";
import GetStartForm from "./GetStartForm";

export default function GetStartPage() {
  const { user, isUserLoading } = useUser();

  // console.log("Loading", isUserLoading);

  if (!user || isUserLoading) {
    return (
      <div className="h-100dvh  w-screen text-center text-2xl font-bold text-sky-300 ">
        <h3 className="block py-[20%]"> Loading ...</h3>
      </div>
    );
  }

  return (
    <div className="bg-sky-200 pb-8">
      <Header user={user}></Header>
      <main className="px-3 md:px-6">
        <GetStartForm user={user}></GetStartForm>
      </main>
    </div>
  );
}
