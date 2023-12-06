import { FirestoreError, doc, updateDoc } from "firebase/firestore";
import { firestore } from "../initialize";
import { UserData } from "@/types/UserData";
import { MatchData, MatchUser } from "@/types/PotentialMatchesPage";

const updateMatchDoc = async (user: UserData, matchUser: MatchUser[]) => {
  try {
    const userRef = doc(firestore, "matches", user.uid);
    const dataToUpdate: MatchData = {
      users: matchUser.map((u) => u.uid),
      matchOn: new Date().toISOString(),
    };
    await updateDoc(userRef, { ...dataToUpdate });

    return true;
  } catch (error) {
    if (error instanceof FirestoreError) {
      console.error("Error updating match document: ", error.message);
    } else if (error instanceof Error) {
      console.error("Error updating match document: ", error.message);
    } else {
      console.error("Error updating match document: ", error);
    }

    return false;
  }
};

export default updateMatchDoc;
