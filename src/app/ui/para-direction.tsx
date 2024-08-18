import { ReactNode } from "react";

const Para = ({ children }: { children: ReactNode }) => {
  return (
    <p className="font-extralight text-xs xl:text-sm text-black leading-tight">
      {children}
    </p>
  );
};

export default Para;
