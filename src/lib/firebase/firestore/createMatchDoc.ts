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
    if (error instanceof FirestoreError) {
      console.error(
        "Error creating potential matches document: ",
        error.message,
      );
    } else if (error instanceof Error) {
      console.error(
        "Error creating potential matches document: ",
        error.message,
      );
    } else {
      console.error(error);
    }

    return false;
  }
};

export default createPotentialMatchDoc;
