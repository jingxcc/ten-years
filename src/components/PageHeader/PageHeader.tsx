import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  children?: ReactNode;
}

export default function PageHeader({ title, children }: PageHeaderProps) {
  return (
    <div className="flex h-[68px] w-full items-center border-b border-neutral-200 bg-white p-4 xs:left-20">
      <h2 className=" mr-4 text-xl  font-bold">{title}</h2>
      {children}
    </div>
  );
}
