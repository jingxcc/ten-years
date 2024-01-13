"use client";
import Sidebar from "@/components/SideBar/SideBar";
import { useUser } from "@/context/userContext";

import { useEffect, useState } from "react";
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
import { UserDetails } from "@/types/UserData";
import { MatchRequestData } from "@/types/PotentialMatchesPage";
import MatchReqCard from "./MatchReqCard";
import { createFriendDoc } from "@/lib/firebase/firestore/createFriendDoc";
import toast from "react-hot-toast";
import PageHeader from "@/components/PageHeader/PageHeader";
import EmptyStateMsg from "@/components/EmptyStateMsg/EmptyStateMsg";

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
            const fromUId = request.fromUserId;
            return getDoc(doc(firestore, "users", fromUId));
          }),
        )
          .then((userDocs) => {
            const fromUserDocs = userDocs.map((userDoc) => {
              return { ...userDoc.data() } as UserDetails;
            });
            setFromUserData(fromUserDocs);
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
      <div className="h-100dvh  w-screen text-center text-2xl font-bold text-sky-300 ">
        <h3 className="block py-[20%]"> Loading ...</h3>
      </div>
    );
  }

  return (
    <div className="relative">
      <Sidebar user={user}></Sidebar>
      <div className="relative flex flex-col pb-20 xs:ml-20 xs:pb-0">
        <PageHeader title="People Like You"></PageHeader>
        <main className="mt-28 ">
          <div className="container mx-auto px-4">
            {fromUserData.length > 0 ? (
              <div className="grid grid-cols-1 justify-items-center gap-4 md:grid-cols-2 xl:grid-cols-3">
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
              <EmptyStateMsg
                title="No Data"
                content="Let's start from Today's Suggestions"
              ></EmptyStateMsg>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
