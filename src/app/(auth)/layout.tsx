import { ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen bg-[#F4F5F6] flex flex-col justify-center">
      {children}
    </div>
  );
};

export default layout;
