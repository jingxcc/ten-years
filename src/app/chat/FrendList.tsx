import { ChatUser } from "@/types/ChatPage";
import { UserData } from "@/types/UserData";

type Props = {
  friends: ChatUser[];
  //   user: UserData;
};

const FriendList: React.FC<Props> = ({ friends }) => {
  return (
    <div className="bodrder-gray-700 container h-full max-w-xs ">
      <h2></h2>
      <ul className="divide-y divide-gray-200">
        {friends.map((friend) => (
          <li
            key={friend.uid}
            className="flex cursor-pointer items-center py-4"
          >
            <img
              className="h-10 w-10 rounded-full"
              src={friend.imageUrls[0]}
              alt={`${friend.nickname}'s avatar`}
            />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">
                {friend.nickname}
              </p>
              {/* <p className="text-sm text-gray-500">Last seen 3 hours ago</p>{" "} */}
              {/* Replace with dynamic data */}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FriendList;
