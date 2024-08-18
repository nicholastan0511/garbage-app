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
    <div className="flex justify-center gap-3 items-center mt-10">
      <p className="text-black text-center">
        Closest garbage to you is {closestLocation.distance} mi away!
      </p>
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
