import { ReactNode } from "react";

interface SideBarProps {
  children?: ReactNode;
}

const Sidebar: React.FC<SideBarProps> = ({ children }) => {
  return (
    <div className="fixed h-full w-32 border-r border-neutral-200 bg-sky-200 p-4">
      <div className="py-4">
        <h1 className="text-xl font-bold">Ten Years</h1>
      </div>
      {children}
    </div>
  );
};

export default Sidebar;
