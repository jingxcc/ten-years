import Image from "next/image";
import { HeartIcon } from "@heroicons/react/24/outline"; // Ensure you have these icons installed
import { MatchUser } from "@/types/PotentialMatchesPage";

interface MatchCardProps {
  matchUser: MatchUser;
  likedUser: string;
  onLike: (userId: string) => void;
}

const MatchCard: React.FC<MatchCardProps> = ({
  matchUser,
  likedUser,
  onLike,
}) => {
  console.log("matchUser", matchUser);
  console.log("likedUser", likedUser);

  return (
    <div className="max-w-sm overflow-hidden rounded pb-32 shadow-lg">
      {/* {matchUser.imageUrls.map((url) => (
        <Image
          className="w-full"
          src={url}
          alt={matchUser.nickname}
          width={384}
          height={384}
        />
      ))} */}

      <div className="h-[220px] overflow-hidden">
        <img
          className="block h-full w-full object-cover object-top"
          src={matchUser["imageUrls"][0]}
          alt={matchUser.nickname}
          //   width={384}
          //   height={220}
          //   objectFit="cover"
          //   objectPosition="center"
        />
      </div>

      <div className="px-6 py-4">
        <div className="mb-2 text-xl font-bold">{matchUser.nickname}</div>
        <p className="text-base text-gray-700">{matchUser.description}</p>

        {likedUser ? (
          <button
            className="mb-2 rounded bg-pink-500 px-4 py-2 font-bold text-white hover:bg-pink-500 focus:bg-red-400 disabled:bg-gray-300"
            onClick={() => onLike(matchUser.uid)}
            disabled={likedUser && likedUser !== matchUser.uid ? true : false}
          >
            <HeartIcon className="h-5 w-5" />
          </button>
        ) : (
          <button
            className="mb-2 rounded bg-pink-300 px-4 py-2 font-bold text-white hover:bg-pink-500 focus:bg-red-400 disabled:bg-gray-300"
            onClick={() => onLike(matchUser.uid)}
            disabled={likedUser && likedUser !== matchUser.uid ? true : false}
          >
            <HeartIcon className="h-5 w-5" />
          </button>
        )}
        <div>
          <h3 className="mb-2 text-base font-bold">興趣</h3>

          {matchUser.interests.map((interest) => (
            <span key={interest} className="mr-4">
              {interest}
            </span>
          ))}
        </div>
      </div>
      <div className="flex justify-between px-6 pb-2 pt-4">
        {/* <button
          className="rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-700"
          onClick={() => onPass(matchUser.id)}
        >
          <XIcon className="h-5 w-5" />
        </button> */}
        {/* Like */}
      </div>
    </div>
  );
};

export default MatchCard;
