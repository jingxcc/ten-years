"use client";
import { useUser } from "@/context/userContext";
import MatchCard from "./MatchCard";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  PotentialMatchData,
  MatchUser,
  PotentialUser,
} from "@/types/PotentialMatchesPage";

import { genderOptions, matchGenderOptions } from "@/constants/GetStartForm";
import {
  and,
  collection,
  doc,
  getDoc,
  getDocs,
  or,
  query,
  serverTimestamp,
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
import fetchPotentialMatchDoc from "@/lib/firebase/firestore/fetchPotentialMatchDoc";
import createPotentialMatchDoc from "@/lib/firebase/firestore/createPotentialMatchDoc";
import updatePotentialMatchDoc from "@/lib/firebase/firestore/updatePotentialMatchDoc";
import { HeartIcon as SolidHeartIcon } from "@heroicons/react/24/solid";
import fetchAllFriendDocIds from "@/lib/firebase/firestore/fetchFriendDoc";
import { createMatchRequests } from "@/lib/firebase/firestore/createMatchRequest";

export default function PotentialMatchesPage() {
  const { user, isUserLoading } = useUser();
  const [potentialUsers, setPotentialUsers] = useState<PotentialUser[]>([]);
  const [potentials, setPotentials] = useState<PotentialMatchData | null>(null);
  // const [likedUser, setLikedUser] = useState<string>("");
  const route = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      route.push("/");
    }
  }, [isUserLoading, user, route]);

  useEffect(() => {
    const fetchMatches = async () => {
      let selectedPotentialUsers: PotentialUser[] = [];
      let selectedMatchData: PotentialMatchData | null = null;

      // let likedMatchUser: string = "";
      if (!user) {
        return false;
      }

      // get potentials doc
      let matchDocResult = await fetchPotentialMatchDoc(user);
      // create potentials doc if not exsits
      if (!matchDocResult) {
        await createPotentialMatchDoc(user, {
          users: [],
        } as PotentialMatchData);
        matchDocResult = {
          users: [],
        };
      } else {
        const matchUIds =
          matchDocResult && matchDocResult["users"]
            ? matchDocResult["users"]
            : [];
        selectedMatchData = matchDocResult;
        // likedMatchUser = fetchDocResult ? fetchDocResult["likedUser"] : "";

        const matchPromises = matchUIds.map((id: string) => {
          const userRef = doc(firestore, "users", id);
          return getDoc(userRef);
        });
        const matchDocs = await Promise.all(matchPromises);
        // console.log("matchDocs", matchDocs);

        selectedPotentialUsers = matchDocs.map((doc) => ({
          ...(doc.data() as PotentialUser),
          uid: doc.id,
        }));
      }

      console.log("matchDocResult", matchDocResult);

      const lastUpdatedOn: string = matchDocResult["lastUpdatedOn"]
        ? matchDocResult["lastUpdatedOn"].toDate().toLocaleDateString()
        : "";
      // const today = new Date().toISOString().split("T")[0];
      const today = new Date().toLocaleDateString();

      // document just created, or not today potentials
      if (!(lastUpdatedOn === today) || matchDocResult["users"].length === 0) {
        // if (!lastUpdatedOn.startsWith(today) || matchDocResult["users"].length === 0) {

        const currentUserDoc = await fetchUserDoc(user);
        if (!currentUserDoc) {
          return false;
        }
        const currentUserData = currentUserDoc["data"];
        console.log("currentUserData", currentUserData);

        const currentFriendDocIds = await fetchAllFriendDocIds(user);
        console.log("currentFriendDocIds", currentFriendDocIds);

        const currentMatchUser: MatchUser = {
          ...(currentUserDoc["data"] as UpdateGetStartFormData),

          uid: currentUserData["uid"],
          friends: currentFriendDocIds,
          aboutMe: currentUserData["aboutMe"] ?? "",
        };

        console.log("currentMatchUser", currentMatchUser);

        const usersRef = collection(firestore, "users");
        // tmp: all genders
        const AllGenderOptionIdx = 2;
        const genderOptionValues = Object.values(genderOptions);
        let q;

        if (
          currentMatchUser.matchGender ===
          matchGenderOptions[AllGenderOptionIdx]["value"]
        ) {
          q = query(
            usersRef,
            where("isStartProfileCompleted", "==", true),
            where("uid", "not-in", [...currentMatchUser.friends, user.uid]),
          );
          // tmp: remove some condtions
        } else {
          q = query(
            usersRef,
            where("isStartProfileCompleted", "==", true),
            where("uid", "not-in", [...currentMatchUser.friends, user.uid]),
            // where("gender", "==", genderOptionValues),
          );
        }

        const querySnapShot = await getDocs(q);
        const querySnapShotData = querySnapShot.docs.map((doc) => ({
          ...(doc.data() as UpdateGetStartFormData),
        }));
        console.log("querySnapShotData", querySnapShotData);

        // const allPotentialUsers: MatchUser[] = querySnapShotData
        //   .map((data) => ({
        //     ...(data as UpdateGetStartFormData),
        //     uid: data["uid"],
        //   }))
        //   .filter((user) => user.uid != currentMatchUser.uid);

        const selectedUsers = shufflePotentialUsers(querySnapShotData);
        console.log("selectedUsers", selectedUsers);

        selectedPotentialUsers = selectedUsers.map((data, index) => ({
          // nickname: data["nickname"],
          // gender: data["gender"],
          // relationshipStatus: data["relationshipStatus"],
          // matchGender: data["matchGender"],
          // expectedRelationships: data["expectedRelationships"],
          // interests: data["interests"],
          // imageUrls: data["imageUrls"],
          // isStartProfileCompleted: data["isStartProfileCompleted"],
          ...(data as UpdateGetStartFormData),
          uid: data["uid"] ?? user.uid,
          aboutMe: data["aboutMe"] ?? "",
        }));

        let dataToUpdate: PotentialMatchData = {
          users: selectedPotentialUsers.map((u) => u.uid),
          lastUpdatedOn: new Date(),
          liked: false,
          userLiked: "",
        };
        const updatePotentialMatchResult = await updatePotentialMatchDoc(
          user,
          dataToUpdate,
        );
        selectedMatchData = dataToUpdate;

        // likedMatchUser = "";
      }

      setPotentialUsers(selectedPotentialUsers);
      setPotentials(selectedMatchData);
      // setLikedUser(likedMatchUser);
    };

    fetchMatches();
  }, [user]);

  const handleLike = async (matchUserId: string) => {
    console.log(matchUserId);
    if (!user) return false;
    const matchRef = doc(firestore, "potentialMatches", user.uid);
    // Update the user's 'liked' status in Firebase

    await updateDoc(matchRef, {
      liked: true,
      userLiked: matchUserId,
    });
    setPotentials({
      ...(potentials as PotentialMatchData),
      liked: true,
      userLiked: matchUserId,
    });

    await createMatchRequests(user.uid, {
      fromUserId: user.uid,
      toUserId: matchUserId,
      status: "sent",
      sendAt: serverTimestamp(),
    });

    // setLikedUser(matchUserId);
    console.log("Liked user", matchUserId);
  };

  // console.log("Loading", isUserLoading);
  console.log("user", user);

  if (isUserLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-full w-full">
      <Sidebar></Sidebar>
      <main className="ml-32">
        <div className="mw-[900px] container mx-auto px-2">
          <div className="mb-4 flex items-center py-8">
            <h2 className=" mr-4 text-2xl font-bold">
              {"Today's Suggestions"}
            </h2>
            <div className="flex min-w-[75px] items-center justify-between rounded-xl border-2 border-sky-300 px-3 py-1">
              <SolidHeartIcon className="mr-1 h-5 w-5 text-rose-400" />
              <span className=" font-bold">
                {potentials && potentials.userLiked ? "00" : "01"}
              </span>
            </div>
          </div>
          {potentials && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {potentialUsers.map((potentialUser) => (
                <MatchCard
                  key={potentialUser.uid}
                  potentialUser={potentialUser}
                  potentials={potentials}
                  // likedUser={likedUser}
                  onLike={handleLike}
                ></MatchCard>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
