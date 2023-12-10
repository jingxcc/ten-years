"use client";

import { useUser } from "../../../context/userContext";
import GetStartForm from "./GetStartForm";

export default function GetStartPage() {
  const { user, isUserLoading } = useUser();

  // console.log("Loading", isUserLoading);
  console.log("user", user);

  if (!user || isUserLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <GetStartForm user={user}></GetStartForm>
    </div>
  );
}
