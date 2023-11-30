import { FirestoreError, doc, updateDoc } from "firebase/firestore";
import { firestore } from "../initialize";
import { UserData } from "@/types/UserData";
import { GetStartFormData, UpdateGetStartFormData } from "@/types/GetStartForm";

const updateGetStartFormDoc = async (
  formData: GetStartFormData,
  user: UserData,
) => {
  try {
    const dataToUpdate: UpdateGetStartFormData = {
      ...formData,
      isStartProfileCompleted: true,
    };
    const userRef = doc(firestore, "users", user.uid);
    await updateDoc(userRef, { ...dataToUpdate });

    return true;
  } catch (error) {
    if (error instanceof FirestoreError) {
      console.error("Error updating user document: ", error.message);
    } else if (error instanceof Error) {
      console.error("Error updating user document: ", error.message);
    } else {
      console.error(error);
    }

    throw new Error("Error submitting the form");
  }
};

export default updateGetStartFormDoc;
