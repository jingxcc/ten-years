"use client";
import { useUser } from "@/context/userContext";
import MatchCard from "./MatchCard";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MatchData, MatchUser } from "@/types/MatchPage";

import { genderOptions, matchGenderOptions } from "@/constants/GetStartForm";
import {
  and,
  collection,
  doc,
  getDoc,
  getDocs,
  or,
  query,
  where,
} from "firebase/firestore";
import { auth, firestore } from "@/lib/firebase/initialize";
import fetchUserDoc from "@/lib/firebase/firestore/fetchUserDoc";
import { shufflePotentialUsers } from "@/lib/generateMatches";
import { UpdateGetStartFormData } from "@/types/GetStartForm";
import fetchMatchDoc from "@/lib/firebase/firestore/fetchMatchDoc";
import createMatchDoc from "@/lib/firebase/firestore/createMatchDoc";
import updateMatchDoc from "@/lib/firebase/firestore/updateMatchDoc";
import Sidebar from "../../components/SideBar/SideBar";
import { signOut } from "firebase/auth";
import { FirebaseError } from "firebase/app";

export default function MatchPage() {
  const { user, isUserLoading } = useUser();
  const [matchUsers, setMatchUsers] = useState<MatchUser[]>([]);
  const route = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      route.push("/");
    }
  }, [isUserLoading, user, route]);

  useEffect(() => {
    const fetchMatches = async () => {
      let selectedMatches: MatchUser[] = [];
      if (!user) {
        return false;
      }

      // get matches doc
      let matchDocResult = await fetchMatchDoc(user);
      if (!matchDocResult) {
        await createMatchDoc(user, {
          users: [],
          matchOn: "",
        } as MatchData);
        matchDocResult = await fetchMatchDoc(user);
      }

      // console.log("matchDocResult", matchDocResult);

      // check matches data
      // const matchData: MatchData = matchDocResult;
      selectedMatches = matchDocResult ? matchDocResult["users"] : [];
      // console.log("selectedMatches from doc", selectedMatches);
      const matchOn: string = matchDocResult ? matchDocResult["matchOn"] : "";
      const today = new Date().toISOString().split("T")[0];
      // document just created, or not today matches
      if (!matchOn.startsWith(today)) {
        const currentUserDoc = await fetchUserDoc(user);
        if (!currentUserDoc) {
          return false;
        }
        const currentUserData = currentUserDoc["data"];
        // console.log("currentUserData", currentUserData);

        const currentUser: MatchUser = {
          // nickname: currentUserData["nickname"],
          // gender: currentUserData["gender"],
          // relationshipStatus: currentUserData["relationshipStatus"],
          // matchGender: currentUserData["matchGender"],
          // expectedRelationships: currentUserData["expectedRelationships"],
          // interests: currentUserData["interests"],
          // imageUrls: currentUserData["imageUrls"],
          // isStartProfileCompleted: currentUserData["isStartProfileCompleted"],
          ...(currentUserDoc["data"] as UpdateGetStartFormData),

          uid: currentUserData["uid"],
          friends: currentUserData["friends"] ?? [],
          description: currentUserData["description"] ?? "",
        };

        // console.log("current user Doc", currentUser);

        // console.log("[...currentUser.friends, user.uid]", [
        //   ...currentUser.friends,
        //   user.uid,
        // ]);
        // console.log("currentUser.matchGender", currentUser.matchGender);

        const usersRef = collection(firestore, "users");

        // tmp: all genders
        const AllGenderOptionIdx = 2;
        const genderOptionValues = Object.values(genderOptions);
        let q;

        // q = query(
        //   usersRef,
        //   and(
        //     where("isStartProfileCompleted", "==", true),

        //     where(
        //       "gender",
        //       "in",
        //       currentUser.matchGender ===
        //         matchGenderOptions[AllGenderOptionIdx]["value"]
        //         ? genderOptionValues
        //         : [currentUser.matchGender],
        //     ),
        //   ),
        // );

        if (
          currentUser.matchGender ===
          matchGenderOptions[AllGenderOptionIdx]["value"]
        ) {
          q = query(
            usersRef,
            where("isStartProfileCompleted", "==", true),
            where("uid", "not-in", [...currentUser.friends, user.uid]),
          );
        } else {
          q = query(
            usersRef,
            where("isStartProfileCompleted", "==", true),
            where("uid", "not-in", [...currentUser.friends, user.uid]),
            where("gender", "==", genderOptionValues),
          );
        }

        const querySnapShot = await getDocs(q);
        const querySnapShotData = querySnapShot.docs.map((doc) => ({
          ...(doc.data() as UpdateGetStartFormData),
          uid: doc.id,
        }));
        // console.log("querySnapShotData", querySnapShotData);

        // const allPotentialUsers: MatchUser[] = querySnapShotData
        //   .map((data) => ({
        //     ...(data as UpdateGetStartFormData),
        //     uid: data["uid"],
        //   }))
        //   .filter((user) => user.uid != currentUser.uid);

        // const allPotentialUsers = querySnapShot.docs.map((doc) => ({
        //   ...(doc.data() as UpdateGetStartFormData),
        // }));

        const allPotentialUsers: MatchUser[] = querySnapShotData.map(
          (data, index) => ({
            nickname: data["nickname"],
            gender: data["gender"],
            relationshipStatus: data["relationshipStatus"],
            matchGender: data["matchGender"],
            expectedRelationships: data["expectedRelationships"],
            interests: data["interests"],
            imageUrls: data["imageUrls"],
            isStartProfileCompleted: data["isStartProfileCompleted"],
            uid: data["uid"],
            friends: data["friends"] ?? [],
            description: data["description"] ?? "",
          }),
        );
        // console.log("allPotentialUsers", allPotentialUsers);

        selectedMatches = shufflePotentialUsers(allPotentialUsers);
        // console.log("selectedMatches", selectedMatches);

        await updateMatchDoc(user, selectedMatches);
      } else {
        // console.log("selectedMatches", selectedMatches);

        // read
        const fetchDocResult = await fetchMatchDoc(user);
        const matchUIds = fetchDocResult ? fetchDocResult["users"] : [];
        const matchPromises = matchUIds.map((id: string) => {
          const userRef = doc(firestore, "users", id);
          return getDoc(userRef);
        });
        const matchDocs = await Promise.all(matchPromises);
        // console.log("matchDocs", matchDocs);

        selectedMatches = matchDocs.map((doc) => ({
          ...(doc.data() as MatchUser),
        }));

        // selectedMatches = matchDocs.map((doc) => {
        //   doc.data() as MatchUser;
        // });

        // console.log("selectedMatches", selectedMatches);
      }
      setMatchUsers(selectedMatches);
    };

    fetchMatches();
  }, [user]);

  const handleLike = async (userId: string) => {
    console.log(userId);
  };

  // console.log("Loading", isUserLoading);
  console.log("user", user);

  if (isUserLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {/* <Sidebar onSignOut={handleSignOut}></Sidebar> */}
      <Sidebar></Sidebar>
      <MatchCard matchUsers={matchUsers} onLike={handleLike}></MatchCard>
    </div>
  );
}
