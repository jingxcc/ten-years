import { ChatUser } from "@/types/ChatPage";
import { UserData } from "@/types/UserData";

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
  return (
    <div className="bodrder-gray-700 container h-full max-w-xs border-r ">
      <h2 className="px-4 py-4 text-lg font-bold ">
        {currentUser?.nickname ?? ""}
      </h2>
      <ul className="">
        {friends.map((friend) => (
          <li
            key={friend.uid}
            className="flex cursor-pointer items-center px-4 py-4 hover:bg-sky-100 focus:bg-sky-100"
            onClick={() => onClickRecipient(friend.uid)}
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
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FriendList;
