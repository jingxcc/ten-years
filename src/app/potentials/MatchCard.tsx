import Image from "next/image";
import { HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as SolidHeartIcon } from "@heroicons/react/24/solid";
import {
  PotentialMatchData,
  PotentialUser,
} from "@/types/PotentialMatchesPage";

interface MatchCardProps {
  potentialUser: PotentialUser;
  potentials: PotentialMatchData;
  // likedUser: string;
  onLike: (userId: string) => void;
}

const MatchCard: React.FC<MatchCardProps> = ({
  potentialUser,
  potentials,
  // likedUser,
  onLike,
}) => {
  console.log("potentialUser", potentialUser);
  // console.log("likedUser", likedUser);

  return (
    <div className="relative max-w-sm overflow-hidden rounded pb-32 shadow-lg">
      {/* {potentialUser.imageUrls.map((url) => (
        <Image
          className="w-full"
          src={url}
          alt={potentialUser.nickname}
          width={384}
          height={384}
        />
      ))} */}

      <div className="h-[220px] overflow-hidden">
        <img
          className="block h-full w-full object-cover object-top"
          src={potentialUser["imageUrls"][0]}
          alt={potentialUser.nickname}
          //   width={384}
          //   height={220}
          //   objectFit="cover"
          //   objectPosition="center"
        />
      </div>

      <div className="px-6 py-4">
        <div className="mb-2 text-xl font-bold">{potentialUser.nickname}</div>
        <p className="text-base text-gray-700">{potentialUser.aboutMe}</p>

        {/* {likedUser ? (
          <button
            className="mb-2 rounded bg-rose-500 px-4 py-2 font-bold text-white hover:bg-rose-500 focus:bg-rose-500 disabled:bg-gray-300"
            onClick={() => onLike(potentialUser.uid)}
            disabled={likedUser && likedUser !== potentialUser.uid ? true : false}
          >
            <HeartIcon className="h-5 w-5" />
          </button>
        ) : (
          <button
            className="mb-2 rounded bg-rose-300 px-4 py-2 font-bold text-white hover:bg-rose-500 focus:bg-rose-500 disabled:bg-gray-300"
            onClick={() => onLike(potentialUser.uid)}
            disabled={likedUser && likedUser !== potentialUser.uid ? true : false}
          >
            <HeartIcon className="h-5 w-5" />
          </button>
        )} */}

        <div>
          {potentials.liked ? (
            <button
              className={`disabled: absolute bottom-4 right-4 mb-2 flex h-[60px] w-[60px] items-center rounded-[30px] bg-rose-300 px-4 py-2 text-white shadow-lg hover:fill-black ${
                potentials.liked && potentials.userLiked !== potentialUser.uid
                  ? "bg-gray-300"
                  : "bg-rose-300"
              } `}
              onClick={() => onLike(potentialUser.uid)}
              disabled
              // disabled={
              //   potentials.liked && potentials.userLiked !== potentialUser.uid
              //     ? true
              //     : false
              // }
            >
              {potentials.liked ? (
                <SolidHeartIcon className="h-8 w-8" />
              ) : (
                <HeartIcon className="h-8 w-8" />
              )}
            </button>
          ) : (
            <button
              className="absolute bottom-4 right-4 mb-2 flex h-[60px] w-[60px] items-center rounded-[30px] bg-white px-4 py-2 text-red-300 shadow-lg hover:bg-red-50 disabled:bg-gray-300"
              onClick={() => onLike(potentialUser.uid)}
            >
              {potentials.liked ? (
                <SolidHeartIcon className="h-8 w-8" />
              ) : (
                <HeartIcon className="h-8 w-8" />
              )}
            </button>
          )}

          <h3 className="mb-2 text-base font-bold">興趣</h3>

          {potentialUser.interests.map((interest) => (
            <span key={interest} className="mr-4">
              {interest}
            </span>
          ))}
        </div>
      </div>
      <div className="flex justify-between px-6 pb-2 pt-4">
        {/* <button
          className="rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-700"
          onClick={() => onPass(potentialUser.id)}
        >
          <XIcon className="h-5 w-5" />
        </button> */}
        {/* Like */}
      </div>
    </div>
  );
};

export default MatchCard;
