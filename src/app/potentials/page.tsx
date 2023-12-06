"use client";
import { useUser } from "@/context/userContext";
import MatchCard from "./MatchCard";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PotentialMatchData, MatchUser } from "@/types/PotentialMatchesPage";

import { genderOptions, matchGenderOptions } from "@/constants/GetStartForm";
import {
  and,
  collection,
  doc,
  getDoc,
  getDocs,
  or,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, firestore } from "@/lib/firebase/initialize";
import fetchUserDoc from "@/lib/firebase/firestore/fetchUserDoc";
import { shufflePotentialUsers } from "@/lib/generateMatches";
import { UpdateGetStartFormData } from "@/types/GetStartForm";
import Sidebar from "../../components/SideBar/SideBar";
import { signOut } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import fetchPotentialMatchDoc from "@/lib/firebase/firestore/fetchMatchDoc";
import createPotentialMatchDoc from "@/lib/firebase/firestore/createMatchDoc";
import updatePotentialMatchDoc from "@/lib/firebase/firestore/updateMatchDoc";

export default function PotentialMatchesPage() {
  const { user, isUserLoading } = useUser();
  const [matchUsers, setMatchUsers] = useState<MatchUser[]>([]);
  const [matches, setMatches] = useState<PotentialMatchData[]>([]);
  const [likedUser, setLikedUser] = useState<string>("");
  const route = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      route.push("/");
    }
  }, [isUserLoading, user, route]);

  useEffect(() => {
    const fetchMatches = async () => {
      let selectedMatches: MatchUser[] = [];
      let likedMatchUser: string = "";
      if (!user) {
        return false;
      }

      // get matches doc
      let matchDocResult = await fetchPotentialMatchDoc(user);
      if (!matchDocResult) {
        await createPotentialMatchDoc(user, {
          users: [],
        } as PotentialMatchData);
        matchDocResult = await fetchPotentialMatchDoc(user);
      }

      console.log("matchDocResult", matchDocResult);

      // check matches data
      selectedMatches = matchDocResult ? matchDocResult["users"] : [];
      // console.log("selectedMatches from doc", selectedMatches);

      const lastUpdatedOn: string = matchDocResult
        ? matchDocResult["lastUpdatedOn"].toDate().toLocaleDateString()
        : "";
      // const today = new Date().toISOString().split("T")[0];
      const today = new Date().toLocaleDateString();

      // document just created, or not today matches
      if (!(lastUpdatedOn === today) || selectedMatches.length === 0) {
        // if (!lastUpdatedOn.startsWith(today) || selectedMatches.length === 0) {
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
          // tmp: remove some condtions
        } else {
          q = query(
            usersRef,
            where("isStartProfileCompleted", "==", true),
            where("uid", "not-in", [...currentUser.friends, user.uid]),
            // where("gender", "==", genderOptionValues),
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

        await updatePotentialMatchDoc(user, selectedMatches);
        likedMatchUser = "";
      } else {
        // console.log("selectedMatches", selectedMatches);

        // read
        const fetchDocResult = await fetchPotentialMatchDoc(user);
        const matchUIds = fetchDocResult ? fetchDocResult["users"] : [];
        likedMatchUser = fetchDocResult ? fetchDocResult["likedUser"] : "";

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
      setLikedUser(likedMatchUser);
    };

    fetchMatches();
  }, [user]);

  const handleLike = async (matchUserId: string) => {
    console.log(matchUserId);
    if (!user) return false;
    const matchRef = doc(firestore, "matches", user.uid);
    // Update the user's 'liked' status in Firebase
    await updateDoc(matchRef, {
      liked: true,
      likedUser: matchUserId,
    });

    setLikedUser(matchUserId);
    console.log("Liked user", matchUserId);
  };

  // console.log("Loading", isUserLoading);
  console.log("user", user);

  if (isUserLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="absolute h-full w-full">
      <Sidebar></Sidebar>
      <main className="mw-[900px] container mx-auto ml-32 mt-16 px-2">
        <h2 className="mb-8 text-center text-lg font-bold ">
          {"Today's Match !"}
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {matchUsers.map((matchUser) => (
            <MatchCard
              key={matchUser.uid}
              matchUser={matchUser}
              likedUser={likedUser}
              onLike={handleLike}
            ></MatchCard>
          ))}
        </div>
      </main>
    </div>
  );
}
