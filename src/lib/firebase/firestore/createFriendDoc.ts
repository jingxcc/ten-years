import { FirestoreError, doc, getDoc, setDoc } from "firebase/firestore";
import { firestore } from "../initialize";
import { Friend } from "@/types/ChatPage";

const createFriendDoc = async (userId: string, friendData: Friend) => {
  const friendDocRef = doc(
    firestore,
    "users",
    userId,
    "friends",
    friendData.friendId,
  );

  try {
    await setDoc(friendDocRef, friendData);
    return true;
  } catch (error) {
    let errMsg: string;

    if (error instanceof FirestoreError) {
      errMsg = `Error creating matches document: ${error.message}`;
    } else if (error instanceof Error) {
      errMsg = `Error creating matches document: ${error.message}`;
    } else {
      errMsg = `Error creating matches document: ${error}`;
    }
    console.error(error);
    throw error;
  }
};

export { createFriendDoc };
