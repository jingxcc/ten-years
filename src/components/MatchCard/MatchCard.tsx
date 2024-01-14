import { UserDetails } from "@/types/UserData";
import Image from "next/image";
import { Children, ReactNode, useState } from "react";
import { SparklesIcon } from "@heroicons/react/24/solid";
import Tag from "../Tag/Tag";
import { child } from "firebase/database";

interface MatchCardProps {
  matchUser: UserDetails;
  onSelect?: (userId: string) => void;
  children?: ReactNode;
}

const MatchCard: React.FC<MatchCardProps> = ({
  matchUser,
  onSelect,
  children,
}) => {
  const [ImgIndx, setImgIndx] = useState<number>(0);

  const handlePrevImg = () => {
    if (matchUser["imageUrls"].length > 1 && ImgIndx > 0)
      setImgIndx((ImgIndx - 1) % (matchUser["imageUrls"].length || 1));
  };

  const handleNextImg = () => {
    if (
      matchUser["imageUrls"].length > 1 &&
      ImgIndx < matchUser["imageUrls"].length - 1
    )
      setImgIndx((ImgIndx + 1) % (matchUser["imageUrls"].length || 1));
  };

  return (
    <div className="relative w-full max-w-sm overflow-hidden rounded-2xl pb-16 shadow-lg">
      <div className="relative h-[280px]  overflow-hidden">
        {matchUser["imageUrls"][ImgIndx] ? (
          <Image
            src={matchUser["imageUrls"][ImgIndx]}
            alt={matchUser.nickname}
            sizes="100vw"
            fill
            className=" border-sky-300 bg-sky-100 object-cover text-sky-300"
          />
        ) : (
          <Image
            src={"/defaultAvatar.jpg"}
            alt={matchUser.nickname}
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
              ImgIndx < matchUser["imageUrls"].length - 1 && "cursor-pointer"
            }`}
            onClick={handleNextImg}
          ></div>
        </div>
        <span className="absolute bottom-2 left-4 w-16 rounded-full border bg-sky-100 text-center">
          {`${ImgIndx + 1} / ${matchUser["imageUrls"].length || 1}`}
        </span>
      </div>
      {/* ES2020 */}
      <div className=" px-6 py-4" onClick={() => onSelect?.(matchUser.uid)}>
        <div className="flex items-center gap-2">
          <div className="mb-2 text-xl font-bold">{matchUser.nickname}</div>
          <SparklesIcon
            className={`${
              matchUser.gender === "男性" ? "text-sky-300" : "text-rose-300"
            }
              
            h-6 w-6`}
            title={matchUser.gender}
          ></SparklesIcon>
        </div>
        <p className="text-base text-gray-700">{matchUser.aboutMe}</p>
        <div>
          <h3 className="mb-4 text-base font-bold">Interests</h3>
          <div className="flex flex-wrap gap-x-3 gap-y-3">
            {matchUser.interests.map((interest) => (
              <Tag key={interest} content={interest}></Tag>
            ))}
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};

export default MatchCard;
