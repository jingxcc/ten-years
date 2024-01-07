import Image from "next/image";
import { HeartIcon } from "@heroicons/react/24/outline";
import {
  HeartIcon as SolidHeartIcon,
  SparklesIcon,
} from "@heroicons/react/24/solid";
import {
  PotentialMatchData,
  PotentialUser,
} from "@/types/PotentialMatchesPage";
import { useState } from "react";

interface MatchCardProps {
  potentialUser: PotentialUser;
  potentials: PotentialMatchData;
  onLike: (userId: string) => void;
}

const MatchCard: React.FC<MatchCardProps> = ({
  potentialUser,
  potentials,
  onLike,
}) => {
  const [ImgIndx, setImgIndx] = useState<number>(0);

  const handlePrevImg = () => {
    if (potentialUser["imageUrls"].length > 1 && ImgIndx > 0)
      setImgIndx((ImgIndx - 1) % (potentialUser["imageUrls"].length || 1));
  };

  const handleNextImg = () => {
    if (
      potentialUser["imageUrls"].length > 1 &&
      ImgIndx < potentialUser["imageUrls"].length - 1
    )
      setImgIndx((ImgIndx + 1) % (potentialUser["imageUrls"].length || 1));
  };

  return (
    <div className="relative w-full max-w-sm overflow-hidden rounded-2xl pb-16 shadow-lg">
      <div className="relative h-[280px]  overflow-hidden">
        {potentialUser["imageUrls"][ImgIndx] ? (
          <Image
            src={potentialUser["imageUrls"][ImgIndx]}
            alt={potentialUser.nickname}
            sizes="100vw"
            fill
            className=" border-sky-300 bg-sky-100 object-cover text-sky-300"
          />
        ) : (
          <Image
            src={"/defaultAvatar.jpg"}
            alt={potentialUser.nickname}
            priority
            sizes="100vw"
            fill
            className=" border-sky-300 bg-sky-100 object-cover text-sky-300"
          />
        )}
        <div className="absolute grid h-full w-full grid-cols-2">
          <div
            className={`${ImgIndx !== 0 && "cursor-pointer"}`}
            onClick={handlePrevImg}
          ></div>
          <div
            className={`${
              ImgIndx < potentialUser["imageUrls"].length - 1 &&
              "cursor-pointer"
            }`}
            onClick={handleNextImg}
          ></div>
        </div>
        <span className="absolute bottom-2 left-4 w-16 rounded-full border bg-sky-100 text-center">
          {`${ImgIndx + 1} / ${potentialUser["imageUrls"].length || 1}`}
        </span>
      </div>

      <div className="px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="mb-2 text-xl font-bold">{potentialUser.nickname}</div>
          <SparklesIcon
            className={`${
              potentialUser.gender === "男性" ? "text-sky-300" : "text-rose-300"
            }
            
          h-6 w-6`}
            title={potentialUser.gender}
          ></SparklesIcon>
        </div>
        <p className="text-base text-gray-700">{potentialUser.aboutMe}</p>
        <div>
          {/* reach like limit */}

          <div className="absolute bottom-0 left-0 flex w-full justify-end">
            {potentials.liked ? (
              <button
                className={`${
                  potentials.userLiked !== potentialUser.uid
                    ? "disabled:bg-gray-300"
                    : "disabled:bg-black-300"
                } mb-4 mr-4 flex h-[60px] w-[60px] items-center rounded-[30px] bg-rose-300 px-4 py-2 text-white shadow-lg`}
                onClick={() => onLike(potentialUser.uid)}
                disabled
              >
                {potentials.userLiked !== potentialUser.uid ? (
                  <HeartIcon className="h-8 w-8" />
                ) : (
                  <SolidHeartIcon className="h-8 w-8" />
                )}
              </button>
            ) : (
              <button
                className={`${
                  potentials.userLiked !== potentialUser.uid
                    ? "disabled:bg-gray-300"
                    : "disabled:bg-black-300"
                } mb-4 mr-4 flex h-[60px] w-[60px] items-center rounded-[30px] bg-white px-4 py-2 text-red-300 shadow-lg hover:bg-rose-100 `}
                onClick={() => onLike(potentialUser.uid)}
              >
                {potentials.userLiked !== potentialUser.uid ? (
                  <HeartIcon className="h-8 w-8" />
                ) : (
                  <SolidHeartIcon className="h-8 w-8" />
                )}
              </button>
            )}
          </div>
          <h3 className="mb-2 text-base font-bold">興趣</h3>
          {potentialUser.interests.map((interest) => (
            <span key={interest} className="mr-4">
              {interest}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MatchCard;
