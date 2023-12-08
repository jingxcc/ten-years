import { FirestoreError, addDoc, collection } from "firebase/firestore";
import { firestore } from "../initialize";
import { MatchRequestData } from "@/types/PotentialMatchesPage";

const createMatchRequests = async (
  userId: string,
  matchRequestData: MatchRequestData,
) => {
  const collectionRef = collection(firestore, "matchRequests");

  try {
    await addDoc(collectionRef, matchRequestData);
    return true;
  } catch (error) {
    let errMsg: string;

    if (error instanceof FirestoreError) {
      errMsg = `Error creating matche requests document: ${error.message}`;
    } else if (error instanceof Error) {
      errMsg = `Error creating matche requests document: ${error.message}`;
    } else {
      errMsg = `Error creating matche requests document: ${error}`;
    }
    console.error(error);
    throw error;
  }
};

export { createMatchRequests };
