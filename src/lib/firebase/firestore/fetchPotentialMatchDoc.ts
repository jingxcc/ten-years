import { FirestoreError, doc, getDoc } from "firebase/firestore";
import { firestore } from "../initialize";
import { UserData } from "@/types/UserData";
import { PotentialMatchData } from "@/types/PotentialMatchesPage";

const fetchPotentialMatchDoc = async (user: UserData) => {
  if (!user) {
    console.error("Error: No user data provided");
    throw new Error("Error: No user data provided");
  }
  try {
    const matchRef = doc(firestore, "potentialMatches", user.uid);
    const docSnap = await getDoc(matchRef);
    if (docSnap.exists()) {
      return docSnap.data() as PotentialMatchData;
    } else {
      // docSnap.data() will be undefined in this case
      console.error(
        "Error getting potential match document: Document Not Found",
      );
      return false;
    }
  } catch (error) {
    let errMsg: string;

    if (error instanceof FirestoreError) {
      errMsg = `Error getting potential match document: ${error.message}`;
    } else if (error instanceof Error) {
      errMsg = `Error getting potential match document: ${error.message}`;
    } else {
      errMsg = `Error getting potential match document: ${error}`;
    }
    console.error(error);
    throw error;
  }
};

export default fetchPotentialMatchDoc;
