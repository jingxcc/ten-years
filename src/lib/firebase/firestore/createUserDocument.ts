import { firestore } from "@/lib/firebase/initialize";
import { UserData } from "@/types/UserData";
import { FirestoreError, doc, setDoc } from "firebase/firestore";

const createUserDocument = async (user: UserData | null): Promise<boolean> => {
  if (!user) {
    console.error("No user data provided");
    return false;
  }

  try {
    await setDoc(doc(firestore, "users", user.uid), user);
    console.log("User document created");

    return true;
  } catch (error) {
    if (error instanceof FirestoreError) {
      console.error("Error creating user document: ", error.message);
    } else if (error instanceof Error) {
      console.error("Error creating user document: ", error.message);
    } else {
      console.error(error);
    }

    return false;
  }
};

export default createUserDocument;
