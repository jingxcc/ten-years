import { firestore } from "@/lib/firebase/initialize";
import { PotentialMatchData } from "@/types/PotentialMatchesPage";
import { UserData } from "@/types/UserData";
import { FirestoreError, doc, setDoc } from "firebase/firestore";

const createPotentialMatchDoc = async (
  user: UserData | null,
  matchData: PotentialMatchData,
): Promise<boolean> => {
  if (!user) {
    console.error("Error: No user data provided");
    return false;
  }

  try {
    await setDoc(doc(firestore, "potentialMatches", user.uid), matchData);
    console.log("Potential matches document created");

    return true;
  } catch (error) {
    let errMsg: string;

    if (error instanceof FirestoreError) {
      errMsg = `Error creating potential matches document: ${error.message}`;
    } else if (error instanceof Error) {
      errMsg = `Error creating potential matches document: ${error.message}`;
    } else {
      errMsg = `Error creating potential matches document: ${error}`;
    }
    console.error(error);
    throw error;
  }
};

export default createPotentialMatchDoc;
