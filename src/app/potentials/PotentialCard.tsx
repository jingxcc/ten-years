import { HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as SolidHeartIcon } from "@heroicons/react/24/solid";
import { PotentialMatchData } from "@/types/PotentialMatchesPage";

import { UserDetails } from "@/types/UserData";
import MatchCard from "@/components/MatchCard/MatchCard";

interface PotentialCardProps {
  potentialUser: UserDetails;
  potentials: PotentialMatchData;
  onLike: (userId: string) => void;
  onSelect: (userId: string) => void;
}

const PotentialCard: React.FC<PotentialCardProps> = ({
  potentialUser,
  potentials,
  onLike,
  onSelect,
}) => {
  return (
    <MatchCard matchUser={potentialUser} onSelect={onSelect}>
      {/* reach like limit */}
      <div className="bg-gradiant-white-b absolute bottom-0 left-[50%] flex w-full -translate-x-1/2 justify-center py-4">
        {potentials.liked ? (
          <button
            className={`${
              potentials.userLiked !== potentialUser.uid
                ? "disabled:bg-gray-300"
                : "disabled:bg-black-300"
            } flex h-[60px] w-[60px] items-center rounded-[30px] bg-rose-300 px-4 py-2 text-white shadow-lg`}
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
            } flex h-[60px] w-[60px] items-center rounded-[30px] bg-white px-4 py-2 text-red-300 shadow-lg hover:bg-rose-100 `}
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
    </MatchCard>
  );
};

export default PotentialCard;
