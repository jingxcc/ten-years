import Image from "next/image";
import { HeartIcon } from "@heroicons/react/24/outline"; // Ensure you have these icons installed
import { MatchUser } from "@/types/MatchPage";

interface MatchCardProps {
  matchUsers: MatchUser[];
  onLike: (userId: string) => void;
}

const MatchCard: React.FC<MatchCardProps> = ({ matchUsers, onLike }) => {
  console.log("matchUsers", matchUsers);

  return (
    <div className="max-w-sm overflow-hidden rounded shadow-lg">
      {/* <Image
        className="w-full"
        src={matchUsers["imageUrls"] ? ""}
        alt={matchUsers["nickname"]}
        width={384}
        height={384}
      /> */}
      {/* <Image
        className="w-full"
        src={matchUsers.imageUrls}
        alt={matchUsers.nickname}
        width={384}
        height={384}
      /> */}
      <div className="px-6 py-4">
        {/* <div className="mb-2 text-xl font-bold">{matchUsers.nickname}</div>
        <p className="text-base text-gray-700">{matchUsers.description}</p> */}
      </div>
      <div className="flex justify-between px-6 pb-2 pt-4">
        {/* <button
          className="rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-700"
          onClick={() => onPass(matchUsers.id)}
        >
          <XIcon className="h-5 w-5" />
        </button> */}
        {/* Like */}
        {/* <button
          className="rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-700"
          onClick={() => onLike(matchUsers.id)}
        >
          <HeartIcon className="h-5 w-5" />
        </button> */}
      </div>
    </div>
  );
};

export default MatchCard;
