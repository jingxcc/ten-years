import firebase from "firebase/compat/app";
import { Timestamp } from "firebase/firestore";

const convertFirestoreTimeStampToDate = (
  firestoreTimeStamp: firebase.firestore.Timestamp,
  dateType: "HH:MM" | "YYYY-MM-DD",
): string => {
  let dateString = "";
  if (!firestoreTimeStamp) return dateString;

  const date = firestoreTimeStamp.toDate();

  if (dateType === "HH:MM") {
    let minute = date.getMinutes();
    let hour = date.getHours();

    dateString = `${hour.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")}`;
  }

  if (dateType === "YYYY-MM-DD") {
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    dateString = `${year}-${month.toString().padStart(2, "0")}-${day
      .toString()
      .padStart(2, "0")}`;
  }
  return dateString;
};

export { convertFirestoreTimeStampToDate };
