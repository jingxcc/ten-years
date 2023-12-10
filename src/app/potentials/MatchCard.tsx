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
          src={potentialUser["imageUrls"][0] ?? "/defaultAvatar.jpg"}
          alt={potentialUser.nickname}
          layout="fill"
          objectFit="cover"
          className=" border-sky-300 bg-sky-100 text-sky-300"
        />
      </div>

      <div className="px-6 py-4">
        <div className="mb-2 text-xl font-bold">{potentialUser.nickname}</div>
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
