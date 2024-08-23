"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Point } from "../lib/definitions";

const ClosestLocation = ({
  closestLocation,
}: {
  closestLocation: Point & { distance: number };
}) => {
  const pathname = usePathname();
  const { replace } = useRouter();
  const searchParams = useSearchParams();

  const handleShowClosestLocation = (
    location: Point & { distance: number }
  ) => {
    const params = new URLSearchParams(searchParams);
    params.set("destination_lat", location.lat.toString());
    params.set("destination_lng", location.lng.toString());
    replace(`${pathname}?${params.toString()}`);
  };

  if (!closestLocation || !closestLocation.lat || !closestLocation.lng)
    return null;

  return (
    <div className="flex flex-col xl:flex-row p-3 justify-center gap-3 items-center bottom-3 xl:bottom-0 xl:left-1 xl:right-auto xl:top-auto pl-3 left-auto right-3 rounded-xl absolute glass text-sm font-light w-2/5 xl:w-auto ">
      {closestLocation.distance >= 1 ? (
        <p className="text-black text-center">
          Closest garbage to you is {closestLocation.distance} km away!
        </p>
      ) : (
        <p className="text-black text-center">
          Closest garbage to you is {closestLocation.distance * 1000} m away!
        </p>
      )}
      <button
        className="btn btn-primary text-white"
        onClick={() => handleShowClosestLocation(closestLocation)}
      >
        show route
      </button>
    </div>
  );
};

export default ClosestLocation;
