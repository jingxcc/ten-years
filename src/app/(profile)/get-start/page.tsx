"use client";

import { useRouter } from "next/navigation";
import { useUser } from "../../../context/userContext";
import { useEffect } from "react";
import GetStartForm from "./GetStartForm";

export default function GetStartPage() {
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
    <div>
      <GetStartForm user={user}></GetStartForm>
    </div>
  );
}
