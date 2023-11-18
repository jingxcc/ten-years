// https://firebasestorage.googleapis.com/v0/b/ten-years-ff6d8.appspot.com/o/users%2FIc627fQwTWfXm7MII424ig43FuF2%2Fteam03.jpg?alt=media&token=6243711e-3cc7-43c6-8b0f-0e2290909808
export default function storageLoader({ src, width, quality }) {
  return `${src}`;
  // return `${src}?w=${width}&q=${quality || 75}`;
}
