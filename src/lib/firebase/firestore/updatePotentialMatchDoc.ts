import { FirestoreError, doc, updateDoc } from "firebase/firestore";
import { firestore } from "../initialize";
import { UserData } from "@/types/UserData";
import { PotentialMatchData, MatchUser } from "@/types/PotentialMatchesPage";

const updatePotentialMatchDoc = async (
  user: UserData,
  matchUser: MatchUser[],
) => {
  try {
    const userRef = doc(firestore, "potentialMatches", user.uid);
    const dataToUpdate: PotentialMatchData = {
      users: matchUser.map((u) => u.uid),
      lastUpdatedOn: new Date(),
    };
    await updateDoc(userRef, { ...dataToUpdate });

    return true;
  } catch (error) {
    if (error instanceof FirestoreError) {
      console.error("Error updating potential match document: ", error.message);
    } else if (error instanceof Error) {
      console.error("Error updating potential match document: ", error.message);
    } else {
      console.error("Error updating potential match document: ", error);
    }

    return false;
  }
};

export default updatePotentialMatchDoc;
