import Image from "next/image";
import { HeartIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { HeartIcon as SolidHeartIcon } from "@heroicons/react/24/solid";
import {
  MatchRequestData,
  PotentialMatchData,
  PotentialUser,
} from "@/types/PotentialMatchesPage";
import { UserDetails } from "@/types/UserData";

interface MatchReqCardProps {
  matchRequest: MatchRequestData;
  requestId: string;
  fromUser: UserDetails;
  onLike: (fromUId: string, requestId: string) => void;
  onReject: (fromUId: string, requestId: string) => void;
}

const MatchReqCard: React.FC<MatchReqCardProps> = ({
  matchRequest,
  requestId,
  fromUser,
  onLike,
  onReject,
}) => {
  console.log("fromUser", fromUser);

  return (
    <div className="relative max-w-sm overflow-hidden rounded-2xl pb-16 shadow-lg">
      {/* {potentialUser.imageUrls.map((url) => (
        <Image
          className="w-full"
          src={url}
          alt={potentialUser.nickname}
          width={384}
          height={384}
        />
      ))} */}

      <div className="relative h-[280px]  overflow-hidden">
        <Image
          src={fromUser["imageUrls"][0] ?? "/defaultAvatar.jpg"}
          alt={fromUser.nickname}
          layout="fill"
          objectFit="cover"
          className=" border-sky-300 bg-sky-100 text-sky-300"
        />
      </div>

      <div className="px-6 py-4">
        <div className="mb-2 text-xl font-bold">{fromUser.nickname}</div>
        <p className="text-base text-gray-700">{fromUser.aboutMe}</p>
        <div>
          {/* reach like limit */}
          <div className="absolute bottom-0 left-0 flex w-full justify-end">
            <button
              className={`mb-4 mr-4 flex h-[60px] w-[60px] items-center rounded-[30px] bg-white px-4 py-2 text-red-300 shadow-lg hover:bg-neutral-100 focus:text-neutral-500`}
              onClick={() => onReject(requestId, matchRequest.fromUserId)}
            >
              {matchRequest.status === "sent" && (
                <XMarkIcon className="h-8 w-8 " />
              )}
              {/* {matchRequest.status === "rejected" && (
                <XMarkIcon className="h-8 w-8 text-gray-500" />
              )} */}
            </button>
            <button
              className={`mb-4 mr-4 flex h-[60px] w-[60px] items-center rounded-[30px] bg-white px-4 py-2 text-red-300 shadow-lg hover:bg-rose-100 focus:bg-rose-100`}
              onClick={() => onLike(requestId, matchRequest.fromUserId)}
            >
              {matchRequest.status === "sent" && (
                <HeartIcon className="h-8 w-8" />
              )}
              {/* {matchRequest.status === "accepted" && (
                <SolidHeartIcon className="h-8 w-8" />
              )} */}
            </button>
          </div>

          <h3 className="mb-2 text-base font-bold">興趣</h3>

          {fromUser.interests.map((interest) => (
            <span key={interest} className="mr-4">
              {interest}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MatchReqCard;
