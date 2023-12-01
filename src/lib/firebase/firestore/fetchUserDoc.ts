import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../initialize";
import { UserData } from "@/types/UserData";

const fetchUserDoc = async (user: UserData) => {
  if (!user) {
    console.error("Error: No user data provided");
    return false;
  }
  const userRef = doc(firestore, "users", user?.uid);
  const docSnap = await getDoc(userRef);
  try {
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
    if (error instanceof Error) {
      console.error("Error getting user document: ", error.message);
    } else {
      console.error("Error getting user document: ", error);
    }
    // console.log("Error getting cached document:", error);
    return false;
  }
};

export default fetchUserDoc;
