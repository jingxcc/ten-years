"use client";
import Sidebar from "@/components/SideBar/SideBar";
import { useUser } from "@/context/userContext";
import { useRouter } from "next/navigation";

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

interface MatchRequestCardData extends MatchRequestData {
  id: string;
}

export default function LikesPage() {
  const { user, isUserLoading } = useUser();
  const [matchRequests, setMatchReqeusts] = useState<MatchRequestCardData[]>(
    [],
  );
  const [fromUserData, setFromUserData] = useState<UserDetails[]>([]);
  const route = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      route.push("/");
    }
  }, [isUserLoading, user, route]);

  useEffect(() => {
    const fetchMatchRequestData = () => {
      if (!user) {
        return false;
      }
      //   await fetchMatchRequestDocs(user);

      const collectionRef = collection(firestore, "matchRequests");

      const q = query(
        collectionRef,
        where("toUserId", "==", user.uid),
        where("status", "==", "sent"),
        orderBy("sendAt", "desc"),
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const newRequests: MatchRequestCardData[] = snapshot.docs.map(
          (doc) => ({
            id: doc.id,
            ...(doc.data() as MatchRequestData),
          }),
        );

        console.log("newRequests", newRequests);

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
            console.log("fromUserDocs", fromUserDocs);
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

    console.log("requestId", requestId);

    const reqRef = doc(firestore, "matchRequests", requestId);

    await updateDoc(reqRef, {
      status: "rejected",
    });
  };

  if (isUserLoading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="h-full w-full">
      <Sidebar></Sidebar>
      <main className="ml-32">
        <div className="mw-[900px] container mx-auto px-2">
          <div className="mb-4 flex items-center py-8">
            <h2 className=" mr-4 text-2xl font-bold">{"People Likes You"}</h2>
          </div>
          {fromUserData.length > 0 && (
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
          )}
        </div>
      </main>
    </div>
  );
}
