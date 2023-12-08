import {
  FirestoreError,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
} from "firebase/firestore";
import { firestore } from "../initialize";
import { UserData } from "@/types/UserData";
import { Friend } from "@/types/ChatPage";

const fetchAllFriendDocIds = async (user: UserData) => {
  if (!user) {
    console.error("Error: No user data provided");
    throw new Error("Error: No user data provided");
  }

  try {
    const friendsRef = collection(firestore, "users", user.uid, "friends");
    const querySnapShot = await getDocs(friendsRef);

    // return empty array if no data
    return querySnapShot.docs.map((doc) => doc.id);
  } catch (error) {
    let errMsg: string;

    if (error instanceof FirestoreError) {
      errMsg = `Error getting match document: ${error.message}`;
    } else if (error instanceof Error) {
      errMsg = `Error getting match document: ${error.message}`;
    } else {
      errMsg = `Error getting match document: ${error}`;
    }
    console.error(error);
    throw error;
  }
};

export default fetchAllFriendDocIds;
