import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  children?: ReactNode;
}

export default function PageHeader({ title, children }: PageHeaderProps) {
  return (
    <div className="fixed left-0 top-0 z-30 flex w-full items-center border-b border-neutral-200 bg-white px-4 py-6 xs:left-20">
      <h2 className=" mr-4 text-2xl  font-bold">{title}</h2>
      {children}
    </div>
  );
}
