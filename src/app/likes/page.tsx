"use client";
import Sidebar from "@/components/SideBar/SideBar";
import { useAuth } from "@/context/authContext";

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
import { createFriendDoc } from "@/lib/firebase/firestore/createFriendDoc";
import toast from "react-hot-toast";
import PageHeader from "@/components/PageHeader/PageHeader";
import EmptyStateMsg from "@/components/EmptyStateMsg/EmptyStateMsg";
import MatchRequestCard from "./MatchRequestCard";
import MatchPanel from "@/components/MatchPanel/MatchPanel";

interface MatchRequestCardData extends MatchRequestData {
  id: string;
}

export default function LikesPage() {
  const { user, isAuthLoading } = useAuth();
  const [matchRequests, setMatchReqeusts] = useState<MatchRequestCardData[]>(
    [],
  );
  const [fromUserData, setFromUserData] = useState<UserDetails[]>([]);
  const [selectedFromUId, setSelectFromUId] = useState<string>("");
  const [showProfilePanel, setShowProfilePanel] = useState<boolean>(false);

  useEffect(() => {
    const fetchMatchRequestData = () => {
      if (!user) {
        return false;
      }

      const collectionRef = collection(firestore, "matchRequests");

      const q = query(
        collectionRef,
        and(where("toUserId", "==", user.uid)),
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

    const reusult = fetchMatchRequestData();
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

  const handleSelect = (matchUserId: string) => {
    setSelectFromUId(matchUserId);
    setShowProfilePanel(true);
  };

  const handleBackToList = () => {
    setShowProfilePanel(false);
  };

  if (!user || isAuthLoading) {
    return (
      <div className="h-100dvh  w-screen text-center text-2xl font-bold text-sky-300 ">
        <h3 className="block py-[20%]"> Loading ...</h3>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className={`${showProfilePanel && "hidden xs:block"}`}>
        <Sidebar user={user}></Sidebar>
      </div>
      <div className=" flex flex-col pb-20 xs:ml-20 xs:pb-0">
        <main className="relative md:flex">
          <div className=" flex  h-100dvh flex-col md:flex-grow">
            <PageHeader title="People Like You"></PageHeader>
            {/* cards*/}
            <div className="overflow-y-auto">
              <div className="container mx-auto px-4 py-10">
                {fromUserData.length > 0 ? (
                  <>
                    {/* sent */}
                    <div className="mb-8">
                      <h3 className="mb-6 pb-2 text-lg font-semibold text-gray-700">
                        Request
                      </h3>

                      {matchRequests.filter((r) => r.status === "sent").length >
                      0 ? (
                        <div className="grid grid-cols-1 justify-items-center gap-4 xl:grid-cols-2 xl:gap-8">
                          {matchRequests
                            .filter((r) => r.status === "sent")
                            .map((request) => (
                              <MatchRequestCard
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
                                onSelect={handleSelect}
                              ></MatchRequestCard>
                            ))}
                        </div>
                      ) : (
                        <EmptyStateMsg title="No Pending Request"></EmptyStateMsg>
                      )}
                    </div>
                    {/* history */}
                    <div>
                      <h3 className="mb-6 pb-2 text-lg font-semibold text-gray-700">
                        History
                      </h3>

                      {matchRequests.filter((r) => r.status !== "sent").length >
                      0 ? (
                        <div className="grid grid-cols-1 justify-items-center gap-4 xl:grid-cols-2 xl:gap-8">
                          {matchRequests
                            .filter((r) => r.status !== "sent")
                            .map((request) => (
                              <MatchRequestCard
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
                                onSelect={handleSelect}
                              ></MatchRequestCard>
                            ))}
                        </div>
                      ) : (
                        <EmptyStateMsg title="No Data"></EmptyStateMsg>
                      )}
                    </div>
                  </>
                ) : (
                  <EmptyStateMsg
                    title="No Data"
                    content="Let's start from Today's Suggestions"
                  ></EmptyStateMsg>
                )}
              </div>
            </div>
          </div>
          {/* panel */}
          <div
            className={`z-40 h-100dvh w-full border-x border-neutral-200 bg-white   md:relative md:w-[420px] md:animate-none ${
              showProfilePanel
                ? "absolute left-0 top-0 animate-slide-in"
                : "hidden md:block"
            }`}
          >
            {selectedFromUId !== "" ? (
              <MatchPanel
                onBackToList={handleBackToList}
                matchUser={fromUserData.find(
                  (user) => user.uid === selectedFromUId,
                )}
              ></MatchPanel>
            ) : (
              <EmptyStateMsg
                title="User Likes You"
                content="Select a card to check profile"
              ></EmptyStateMsg>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
