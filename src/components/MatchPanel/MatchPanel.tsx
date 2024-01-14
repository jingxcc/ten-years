import { UserDetails } from "@/types/UserData";
import Image from "next/image";
import { ReactNode, useState } from "react";
import { SparklesIcon } from "@heroicons/react/24/solid";
import Tag from "../Tag/Tag";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";

interface MatchPanelProps {
  matchUser: UserDetails | undefined;
  onBackToList: () => void;
  children?: ReactNode;
}

const MatchPanel: React.FC<MatchPanelProps> = ({
  matchUser,
  children,
  onBackToList,
}) => {
  const [ImgIndx, setImgIndx] = useState<number>(0);

  if (!matchUser) return null;

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
    <div className="relative w-full">
      <div className="relative flex h-[68px] w-full items-center justify-center border-b border-neutral-200 bg-white p-4">
        <button
          className="absolute left-2 top-[50%] mr-3 -translate-y-1/2 items-center p-2 lg:hidden"
          onClick={onBackToList}
        >
          <ChevronLeftIcon className="h-5 w-5"></ChevronLeftIcon>
        </button>
        <h2 className=" text-md font-bold">{`Profile`}</h2>
        {children}
      </div>

      <div className="overflow-y-auto">
        <div className="relative aspect-square  overflow-hidden">
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
        <div className=" flex flex-col gap-y-4 px-6 py-4">
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
          {/* <p className="text-base text-gray-700">{matchUser.aboutMe}</p> */}
          <div>
            <h3 className="mb-4 text-base font-bold">Interests</h3>
            <div className="flex flex-wrap gap-x-3 gap-y-3">
              {matchUser.interests.map((interest) => (
                <Tag key={interest} content={interest}></Tag>
              ))}
            </div>
          </div>
          <div>
            <h3 className="mb-4 text-base font-bold">Expected Relationship</h3>
            <div className="flex flex-wrap gap-x-3 gap-y-3">
              {matchUser.expectedRelationships.map((relationship) => (
                <Tag key={relationship} content={relationship}></Tag>
              ))}
            </div>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default MatchPanel;
