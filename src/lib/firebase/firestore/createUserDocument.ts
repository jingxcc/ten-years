import { firestore } from "@/lib/firebase/initialize";
import { UserData } from "@/types/UserData";
import { FirestoreError, doc, setDoc } from "firebase/firestore";

const createUserDocument = async (user: UserData | null): Promise<boolean> => {
  if (!user) {
    console.error("Error: No user data provided");
    throw new Error("Error: No user data provided");
  }

  try {
    await setDoc(doc(firestore, "users", user.uid), user);
    console.log("User document created");

    return true;
  } catch (error) {
    let errMsg: string;

    if (error instanceof FirestoreError) {
      errMsg = `Error creating user document: ${error.message}`;
    } else if (error instanceof Error) {
      errMsg = `Error creating user document: ${error.message}`;
    } else {
      errMsg = `Error creating user document: ${error}`;
    }
    console.error(error);
    throw error;
  }
};

export default createUserDocument;
