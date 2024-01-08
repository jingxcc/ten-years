import { ChatUser } from "@/types/ChatPage";
import Image from "next/image";

type Props = {
  friends: ChatUser[];
  currentUser: ChatUser;
  onClickRecipient: (recipientUId: string) => void;
};

const FriendList: React.FC<Props> = ({
  friends,
  currentUser,
  onClickRecipient,
}) => {
  console.log("friendslist");

  return (
    <>
      <div className="max-h-[60px] bg-white xs:left-20 ">
        <h2 className=" px-4 py-4 text-lg font-bold ">
          {currentUser?.nickname ?? currentUser.email}
        </h2>
      </div>
      {friends.length === 0 ? (
        <div className="r h-full w-full p-4 text-base font-semibold text-gray-400">
          <p className="mb-2 block pt-6">{"No Friend Data "}</p>
          <p className="block">{"Let's start from Today's Suggestions"}</p>
        </div>
      ) : (
        <ul className="flex-grow overflow-y-auto pb-16 xs:pb-0">
          {friends.map((friend) => (
            <li
              key={friend.uid}
              className="flex cursor-pointer items-center py-4 pl-4 pr-8 hover:bg-sky-100 focus:bg-sky-100"
              onClick={() => onClickRecipient(friend.uid)}
            >
              <div className="relative mr-3 h-10 w-10 overflow-hidden rounded-full">
                <Image
                  src={
                    friend["imageUrls"] && friend["imageUrls"].length !== 0
                      ? friend["imageUrls"][0]
                      : "/defaultAvatar.jpg"
                  }
                  alt={`${friend.nickname}'s avatar`}
                  priority
                  width={80}
                  height={80}
                  className=" h-full w-full border-sky-300 bg-sky-100 object-cover object-center text-sky-300"
                />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">
                  {friend?.nickname ?? friend.email}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default FriendList;
