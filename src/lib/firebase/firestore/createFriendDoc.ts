import { doc, getDoc, setDoc } from "firebase/firestore";
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

  // Check if the friend document exists
  const docSnap = await getDoc(friendDocRef);

  // If the document does not exist, create it
  if (!docSnap.exists()) {
    await setDoc(friendDocRef, friendData);
    console.log("Friend document created!");
  } else {
    console.log("Friend document already exists.");
  }
  // tmp: add error
};

export { createFriendDoc };
