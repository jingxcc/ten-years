import { firestore } from "@/lib/firebase/initialize";
import { MatchData } from "@/types/PotentialMatchesPage";
import { UserData } from "@/types/UserData";
import { FirestoreError, doc, setDoc } from "firebase/firestore";

const createMatchDoc = async (
  user: UserData | null,
  matchData: MatchData,
): Promise<boolean> => {
  if (!user) {
    console.error("Error: No user data provided");
    return false;
  }

  try {
    await setDoc(doc(firestore, "matches", user.uid), matchData);
    console.log("Match document created");

    return true;
  } catch (error) {
    if (error instanceof FirestoreError) {
      console.error("Error creating match document: ", error.message);
    } else if (error instanceof Error) {
      console.error("Error creating match document: ", error.message);
    } else {
      console.error(error);
    }

    return false;
  }
};

export default createMatchDoc;
