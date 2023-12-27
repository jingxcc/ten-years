import { ChatUser } from "@/types/ChatPage";
import { UserData } from "@/types/UserData";
import Image from "next/image";

type Props = {
  friends: ChatUser[];
  currentUser: ChatUser | null;
  onClickRecipient: (recipientUId: string) => void;
  //   user: UserData;
};

const FriendList: React.FC<Props> = ({
  friends,
  currentUser,
  onClickRecipient,
}) => {
  // console.log("currentUser", currentUser);

  return (
    <div className="bodrder-gray-700 h-full max-w-xs border-r ">
      <h2 className="px-4 py-4 text-lg font-bold ">
        {currentUser?.nickname ?? currentUser?.email}
      </h2>
      <ul className="">
        {friends.map((friend) => (
          <li
            key={friend.uid}
            className="flex cursor-pointer items-center px-4 py-4 hover:bg-sky-100 focus:bg-sky-100"
            onClick={() => onClickRecipient(friend.uid)}
          >
            <div className="relative h-10 w-10 overflow-hidden rounded-full">
              <Image
                src={
                  friend["imageUrls"] && friend["imageUrls"].length !== 0
                    ? friend["imageUrls"][0]
                    : "/defaultAvatar.jpg"
                }
                alt={`${friend.nickname}'s avatar`}
                priority
                width={40}
                height={40}
                className=" h-full w-full border-sky-300 bg-sky-100 object-cover object-center text-sky-300"
              />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">
                {friend.nickname ?? friend.email ?? "Unknown User"}
              </p>
              {/* <p className="text-sm text-gray-500">Last seen 3 hours ago</p>{" "} */}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FriendList;
