import { FirestoreError, doc, getDoc } from "firebase/firestore";
import { firestore } from "../initialize";
import { UserData } from "@/types/UserData";

const fetchUserDoc = async (user: UserData) => {
  if (!user) {
    console.error("Error: No user data provided");
    throw new Error("Error: No user data provided");
  }
  try {
    const userRef = doc(firestore, "users", user?.uid);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      //   console.log("Document data:", docSnap.data());

      return {
        data: docSnap.data(),
      };
    } else {
      // docSnap.data() will be undefined in this case
      console.error("Error getting user document: Document Not Found");
      return false;
    }
  } catch (error) {
    let errMsg: string;

    if (error instanceof FirestoreError) {
      errMsg = `Error getting user document: ${error.message}`;
    } else if (error instanceof Error) {
      errMsg = `Error getting user document: ${error.message}`;
    } else {
      errMsg = `Error getting user document: ${error}`;
    }
    console.error(error);
    throw error;
  }
};

export default fetchUserDoc;
