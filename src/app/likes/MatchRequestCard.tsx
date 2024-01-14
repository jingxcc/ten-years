import { HeartIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { HeartIcon as SolidHeartIcon } from "@heroicons/react/24/solid";
import { MatchRequestData } from "@/types/PotentialMatchesPage";
import { UserDetails } from "@/types/UserData";
import MatchCard from "@/components/MatchCard/MatchCard";

interface MatchRequestCardProps {
  matchRequest: MatchRequestData;
  requestId: string;
  fromUser: UserDetails;
  onLike: (fromUId: string, requestId: string) => void;
  onReject: (fromUId: string, requestId: string) => void;
  onSelect: (fromUId: string) => void;
}

const MatchRequestCard: React.FC<MatchRequestCardProps> = ({
  matchRequest,
  requestId,
  fromUser,
  onLike,
  onReject,
  onSelect,
}) => {
  return (
    <MatchCard matchUser={fromUser} onSelect={onSelect}>
      {/* like or reject */}
      <div className="bg-gradiant-white-b absolute bottom-0 left-[50%] flex w-full -translate-x-1/2 justify-center py-4">
        {matchRequest.status === "sent" && (
          <button
            className={`mb-4 mr-4 flex h-[60px] w-[60px] items-center rounded-[30px] bg-white px-4 py-2 text-neutral-300 shadow-lg hover:bg-neutral-100 focus:bg-neutral-100`}
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
          </button>
        )}

        {matchRequest.status === "accepted" && (
          <button
            className={`mb-4 mr-4 flex h-[60px] w-[60px] items-center rounded-[30px] bg-rose-300 px-4 py-2 text-white shadow-lg `}
            onClick={() => onLike(requestId, matchRequest.fromUserId)}
            disabled
          >
            <SolidHeartIcon className="h-8 w-8" />
          </button>
        )}

        {matchRequest.status === "rejected" && (
          <button
            className={`mb-4 mr-4 flex h-[60px] w-[60px] items-center rounded-[30px] bg-neutral-300 px-4 py-2 text-white shadow-lg `}
            onClick={() => onLike(requestId, matchRequest.fromUserId)}
            disabled
          >
            <XMarkIcon className="h-8 w-8 " />
          </button>
        )}
      </div>
    </MatchCard>
  );
};

export default MatchRequestCard;
