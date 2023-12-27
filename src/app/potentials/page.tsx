"use client";
import { useUser } from "@/context/userContext";
import MatchCard from "./MatchCard";
import { useEffect, useState } from "react";
import {
  PotentialMatchData,
  MatchUser,
  PotentialUser,
  MatchRequestData,
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
import toast from "react-hot-toast";
import { UserData } from "@/types/UserData";

// lib
const fetchMatchRequestData = async (user: UserData) => {
  const collectionRef = collection(firestore, "matchRequests");
  // tmp: consider if the get the same suggestion today!
  const q = query(
    collectionRef,
    and(
      or(where("toUserId", "==", user.uid), where("from", "==", user.uid)),
      where("status", "!=", "accepted"),
    ),
  );

  try {
    const queryResult = await getDocs(q);
    return queryResult;
  } catch (error) {
    console.error("Error fetch match request docs", error);
  }
};

export default function PotentialMatchesPage() {
  const { user, isUserLoading } = useUser();
  const [potentialUsers, setPotentialUsers] = useState<PotentialUser[]>([]);
  const [potentials, setPotentials] = useState<PotentialMatchData | null>(null);
  // const [likedUser, setLikedUser] = useState<string>("");

  useEffect(() => {
    const fetchMatches = async () => {
      if (!user) {
        return false;
      }
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

        const currentFriendDocIds = await fetchAllFriendDocIds(user);

        const matchReqDocResult = await fetchMatchRequestData(user);

        // not match request
        let matchReqData: string[] = [];
        if (matchReqDocResult && matchReqDocResult.docs.length > 0) {
          matchReqDocResult.docs.forEach((doc) => {
            const docData = doc.data() as MatchRequestData;
            matchReqData.push(
              docData.fromUserId === user.uid
                ? docData.toUserId
                : docData.fromUserId,
            );
          });
        }

        const currentMatchUser: MatchUser = {
          ...(currentUserDoc["data"] as UpdateGetStartFormData),

          uid: user.uid,
          friends: currentFriendDocIds,
          aboutMe: currentUserData["aboutMe"] ?? "",
        };

        const usersRef = collection(firestore, "users");
        // tmp: all genders
        const AllGenderOptionIdx = 2;
        // const genderOptionValues = Object.values(genderOptions);
        let q;

        if (
          currentMatchUser.matchGender ===
          matchGenderOptions[AllGenderOptionIdx]["value"]
        ) {
          q = query(
            usersRef,
            where("isStartProfileCompleted", "==", true),
            where("uid", "not-in", [
              ...currentMatchUser.friends,
              ...matchReqData,
              user.uid,
            ]),
          );

          // tmp: remove some condtions
        } else {
          q = query(
            usersRef,
            where("isStartProfileCompleted", "==", true),
            where("uid", "not-in", [
              ...currentMatchUser.friends,
              // ...matchReqData,
              user.uid,
            ]),
            where("gender", "==", currentMatchUser.matchGender),
          );
        }

        // console.log(
        //   "gender test",
        //   matchGenderOptions[AllGenderOptionIdx]["value"],
        //   genderOptionValues,
        // );

        const querySnapShot = await getDocs(q);
        const querySnapShotData = querySnapShot.docs.map((doc) => ({
          ...(doc.data() as UpdateGetStartFormData),
        }));

        // const allPotentialUsers: MatchUser[] = querySnapShotData
        //   .map((data) => ({
        //     ...(data as UpdateGetStartFormData),
        //     uid: data["uid"],
        //   }))
        //   .filter((user) => user.uid != currentMatchUser.uid);

        const selectedUsers = shufflePotentialUsers(querySnapShotData);

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

    toast.success("Likes Success !", {
      style: {
        backgroundColor: "#fbcfe8",
      },
      icon: "✨",
    });
    // setLikedUser(matchUserId);
  };

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
      <main className="ml-20">
        <div className="container mx-auto px-2">
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
