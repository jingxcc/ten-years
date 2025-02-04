# [Ten Years](https://ten-years-lilac.vercel.app)

<!-- TODO: text center -->

ＡTen Years is a matching website that allows you to meet and chat with new people.

<img src="./public/README/home.svg" width="900" alt="home"></img>

- Test Account
  - Email: test01@test.com
  - Password: 000000

# Tech Stack

<!-- TODO: img/補上圖片 -->

## Front-end

- React
  - `useContext`: Used for verifying login status on each page
  - `React memo`: Prevents re-rendering of the Message component when typing in textarea (i.e. triggered by `onChange`) events occur
- TypeScript
- Next.js
  - Router, Image
- Tailwind CSS
- Jest: Takes snapshots of the component to ensure they remain consistent over time

## Back-end

- Firebase
  - Authentication
  - Firestore Database
  - Storage
- Vercel

## Tools

- ESLint/Prettier
- Git

# Main Features

1. Sign up and fill in basic information

   - Your image will be automatically saved after upload.

   ![start-profile](./public/README/gif/signupProfile.gif)

2. Start Finding Your Match from "Today's Suggestions"!

   - After logging each day, you'll receive today's potential matches. Click on the photo to view images, and the text area to view user profiles.
   - Depending on your heart quota, send likes to your favorite one!
   - Matchmaking logic: - candidates who are not friends - have not sent a friend request previously. -

   ![suggest](./public/README/gif/suggest.gif)

3. Successful Matchmaking

   - Go to "Like You" to see if someone likes you!
   - Historical data is also available below for review.
   - A match is successful when the other person likes you back, and you can see the matched individuals in the Chat!

   ![match](./public/README/gif/match.gif)

4. Instant Messaging

- Chat with the other person through text to get to know them better :)

  ![chat](./public/README/gif/chat.gif)


# Database Schema

- ID: document ID in Firebase

  <img src="./public/README/databaseSchema.svg" width="900" alt="database-schema"></img>

# Contact

- Name: Xiao-Jing Chen 陳筱靜
- Email: vera.xj.chen@gmail.com
- LinkedIn: [in/vera-xj-chen](https://www.linkedin.com/in/vera-xj-chen/)
