import Image from "next/image";
import { HeartIcon, XMarkIcon } from "@heroicons/react/24/outline";
import {
  HeartIcon as SolidHeartIcon,
  SparklesIcon,
} from "@heroicons/react/24/solid";
import {
  MatchRequestData,
  PotentialMatchData,
} from "@/types/PotentialMatchesPage";
import { UserDetails } from "@/types/UserData";
import { useState } from "react";

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
  const [ImgIndx, setImgIndx] = useState<number>(0);
  console.log("fromUser", fromUser);

  const handlePrevImg = () => {
    if (fromUser["imageUrls"].length > 1 && ImgIndx > 0)
      setImgIndx((ImgIndx - 1) % (fromUser["imageUrls"].length || 1));
  };

  const handleNextImg = () => {
    if (
      fromUser["imageUrls"].length > 1 &&
      ImgIndx < fromUser["imageUrls"].length - 1
    )
      setImgIndx((ImgIndx + 1) % (fromUser["imageUrls"].length || 1));
  };

  return (
    <div className="relative max-w-sm overflow-hidden rounded-2xl pb-16 shadow-lg">
      {/* {fromUser.imageUrls.map((url) => (
        <Image
          className="w-full"
          src={url}
          alt={fromUser.nickname}
          width={384}
          height={384}
        />
      ))} */}

      <div className="relative h-[280px]  overflow-hidden">
        <Image
          src={fromUser["imageUrls"][ImgIndx] ?? "/defaultAvatar.jpg"}
          alt={fromUser.nickname}
          layout="fill"
          objectFit="cover"
          className=" border-sky-300 bg-sky-100 text-sky-300"
        />
        <div className="absolute grid h-full w-full grid-cols-2">
          <div className="absolute grid h-full w-full grid-cols-2">
            <div
              className={`${ImgIndx !== 0 && "cursor-pointer"}`}
              onClick={handlePrevImg}
            ></div>
            <div
              className={`${
                ImgIndx < fromUser["imageUrls"].length - 1 && "cursor-pointer"
              }`}
              onClick={handleNextImg}
            ></div>
          </div>
        </div>
        <span className="absolute bottom-2 left-4 w-16 rounded-full border bg-sky-100 text-center">
          {`${ImgIndx + 1} / ${fromUser["imageUrls"].length || 1}`}
        </span>
      </div>

      <div className="px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="mb-2 text-xl font-bold">{fromUser.nickname}</div>
          <SparklesIcon
            className={`${
              fromUser.gender === "男性" ? "text-sky-300" : "text-rose-300"
            }
            
          h-6 w-6`}
            title={fromUser.gender}
          ></SparklesIcon>
        </div>
        <p className="text-base text-gray-700">{fromUser.aboutMe}</p>
        <div>
          {/* reach like limit */}
          <div className="absolute bottom-0 left-0 flex w-full justify-end">
            {matchRequest.status === "sent" && (
              <button
                className={`mb-4 mr-4 flex h-[60px] w-[60px] items-center rounded-[30px] bg-white px-4 py-2 text-red-300 shadow-lg hover:bg-neutral-100 focus:text-neutral-500`}
                onClick={() => onReject(requestId, matchRequest.fromUserId)}
              >
                <XMarkIcon className="h-8 w-8 " />
              </button>
            )}

            {matchRequest.status === "sent" && (
              <button
                className={`mb-4 mr-4 flex h-[60px] w-[60px] items-center rounded-[30px] bg-white px-4 py-2 text-red-300 shadow-lg hover:bg-rose-100 focus:bg-rose-100`}
                onClick={() => onLike(requestId, matchRequest.fromUserId)}
              >
                <HeartIcon className="h-8 w-8" />
                {/* {matchRequest.status === "accepted" && (
                <SolidHeartIcon className="h-8 w-8" />
              )} */}
              </button>
            )}

            {matchRequest.status === "accepted" && (
              <button
                className={`mb-4 mr-4 flex h-[60px] w-[60px] items-center rounded-[30px] bg-white px-4 py-2 text-red-300 shadow-lg `}
                onClick={() => onLike(requestId, matchRequest.fromUserId)}
                disabled
              >
                <SolidHeartIcon className="h-8 w-8" />
              </button>
            )}
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
