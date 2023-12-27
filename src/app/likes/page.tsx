"use client";
import Sidebar from "@/components/SideBar/SideBar";
import { useUser } from "@/context/userContext";

import { useEffect, useState } from "react";
import MatchCard from "./MatchReqCard";
import fetchPotentialMatchDoc from "@/lib/firebase/firestore/fetchPotentialMatchDoc";
import {
  and,
  collection,
  doc,
  getDoc,
  onSnapshot,
  or,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { firestore } from "@/lib/firebase/initialize";
import { UserData, UserDetails } from "@/types/UserData";
import { MatchRequestData, MatchUser } from "@/types/PotentialMatchesPage";
import { ChatUser } from "@/types/ChatPage";
import { UpdateGetStartFormData } from "@/types/GetStartForm";
import MatchReqCard from "./MatchReqCard";
import { createFriendDoc } from "@/lib/firebase/firestore/createFriendDoc";
import toast from "react-hot-toast";

interface MatchRequestCardData extends MatchRequestData {
  id: string;
}

export default function LikesPage() {
  const { user, isUserLoading } = useUser();
  const [matchRequests, setMatchReqeusts] = useState<MatchRequestCardData[]>(
    [],
  );
  const [fromUserData, setFromUserData] = useState<UserDetails[]>([]);

  useEffect(() => {
    const fetchMatchRequestData = () => {
      if (!user) {
        return false;
      }
      //   await fetchMatchRequestDocs(user);

      const collectionRef = collection(firestore, "matchRequests");

      const q = query(
        collectionRef,
        and(
          where("toUserId", "==", user.uid),
          or(where("status", "==", "sent"), where("status", "==", "accepted")),
        ),
        orderBy("sendAt", "desc"),
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const newRequests: MatchRequestCardData[] = snapshot.docs.map(
          (doc) => ({
            id: doc.id,
            ...(doc.data() as MatchRequestData),
          }),
        );

        setMatchReqeusts(newRequests);

        Promise.all(
          newRequests.map((request) => {
            // Assume each friend document has a field 'friendId' that is the user's ID
            const fromUId = request.fromUserId;
            return getDoc(doc(firestore, "users", fromUId));
          }),
        )
          .then((userDocs) => {
            // Map over each document to create User objects
            const fromUserDocs = userDocs.map((userDoc) => {
              return { ...userDoc.data() } as UserDetails;
            });
            setFromUserData(fromUserDocs);
            // console.log("fromUserDocs", fromUserDocs);
          })
          .catch((error) => {
            console.error("Error fetching match request data:", error);
          });
      });
      return () => unsubscribe();
    };

    // const fetchMatchRequestDocs = async (user: UserData) => {

    // };
    const reusult = fetchMatchRequestData();
    // return () => (reusult ? reusult() : null);
  }, [user]);

  //   useEffect(() => {
  //     console.log("before promise matchRequests", matchRequests);

  //     Promise.all(
  //       matchRequests.map((request) => {
  //         // Assume each friend document has a field 'friendId' that is the user's ID
  //         const fromUId = request.fromUserId;
  //         return getDoc(doc(firestore, "users", fromUId));
  //       }),
  //     )
  //       .then((userDocs) => {
  //         // Map over each document to create User objects
  //         const fromUserDocs = userDocs.map((userDoc) => {
  //           return { ...userDoc.data() } as UserDetails;
  //         });
  //         setFromUserData(fromUserDocs);
  //         console.log("fromUserDocs", fromUserDocs);
  //       })
  //       .catch((error) => {
  //         console.error("Error fetching match request data:", error);
  //       });
  //   }, [matchRequests]);

  const handleLike = async (requestId: string, fromUId: string) => {
    if (!user) return false;
    const reqRef = doc(firestore, "matchRequests", requestId);

    await updateDoc(reqRef, {
      status: "accepted",
    });

    toast.success("Likes Success !", {
      style: {
        backgroundColor: "#fbcfe8",
      },
      icon: "✨",
    });

    // create matches doc
    // tmp: 修正資料結構
    await createFriendDoc(user.uid, {
      friendId: fromUId,
      addedOn: serverTimestamp(),
    });

    await createFriendDoc(fromUId, {
      friendId: user.uid,
      addedOn: serverTimestamp(),
    });
  };

  const handleReject = async (requestId: string, fromUId: string) => {
    if (!user) return false;

    const reqRef = doc(firestore, "matchRequests", requestId);

    await updateDoc(reqRef, {
      status: "rejected",
    });
  };

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
            <h2 className=" mr-4 text-2xl font-bold">{"People Likes You"}</h2>
          </div>
          {fromUserData.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {matchRequests.map((request) => (
                <MatchReqCard
                  key={request.id}
                  matchRequest={request}
                  requestId={request.id}
                  fromUser={
                    fromUserData.filter(
                      (data) => data.uid === request.fromUserId,
                    )[0]
                  }
                  onLike={handleLike}
                  onReject={handleReject}
                ></MatchReqCard>
              ))}
            </div>
          ) : (
            <div className="r h-full w-full text-lg font-semibold text-gray-400 ">
              <h3 className="mb-2 block pt-6">{"No Data "}</h3>
              <h3 className="block">
                {"Let's start from Today's Suggestions !"}
              </h3>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
