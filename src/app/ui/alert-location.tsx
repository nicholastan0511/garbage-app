"use client";
import { useState } from "react";

const AlertLocation = () => {
  const [open, setOpen] = useState(true);

  if (!open) return null;
  else {
    if (open) {
      setTimeout(() => {
        setOpen(false);
      }, 7000);
    }
  }

  return (
    <div
      role="alert"
      className="alert alert-warning w-2/3 absolute bottom-10 z-50"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 shrink-0 stroke-current"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
      <div
        className="absolute right-5 hover:cursor-pointer"
        onClick={() => setOpen(false)}
      >
        x
      </div>
      <span>Please turn on location for best user experience.</span>
    </div>
  );
};

export default AlertLocation;
