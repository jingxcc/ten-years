import { ReactNode, useRef, useState } from "react";

interface TooltipProps {
  text: string;
  children?: ReactNode;
}

export default function Tooltip({ text, children }: TooltipProps) {
  const [isShow, setIsShow] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    setIsHover(true);
    timeoutIdRef.current = setTimeout(() => {
      setIsShow(true);
    }, 1000);
  };

  const handleMouseLeave = () => {
    if (isHover) {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
      setIsShow(false);
    }
    setIsHover(false);
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {isShow && (
        <div className="absolute left-[120%] top-[50%] -translate-y-1/2 whitespace-nowrap rounded-sm  bg-sky-800 p-1 text-xs text-white">
          {`${text}`}
        </div>
      )}
    </div>
  );
}
