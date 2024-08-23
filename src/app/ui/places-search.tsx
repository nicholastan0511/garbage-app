import { useMapsLibrary, useMap } from "@vis.gl/react-google-maps";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const SearchBar = () => {
  const pathname = usePathname();
  const { replace } = useRouter();
  const searchParams = useSearchParams();

  const placesLib = useMapsLibrary("places");
  const map = useMap();
  const inputRef = useRef<HTMLInputElement>(null);
  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    if (!map || !placesLib || !inputRef.current) return;

    const options = {
      fields: ["geometry", "name", "formatted_address"],
    };

    setAutocomplete(new placesLib.Autocomplete(inputRef.current, options));
  }, [map, placesLib]);

  const onSelect = (
    position: google.maps.LatLng | undefined,
    name: string | undefined,
    address: string | undefined,
    viewport: any
  ) => {
    if (!position || !name || !address) return;
    console.log("Position log", position);
    const { lat, lng } = position;
    const params = new URLSearchParams(searchParams);
    params.set("search_lat", lat().toString());
    params.set("search_lng", lng().toString());
    params.set("search_name", name);
    params.set("search_address", address);
    replace(`${pathname}?${params.toString()}`);
  };

  // handle when user select an autocomplete option
  useEffect(() => {
    if (!autocomplete) return;

    autocomplete.addListener("place_changed", () => {
      const selectedPlace = autocomplete.getPlace();
      if (!map || !selectedPlace || !selectedPlace.geometry) return;
      const position = selectedPlace.geometry.location;
      const name = selectedPlace.name;
      const address = selectedPlace.formatted_address;
      const viewport = selectedPlace.geometry.viewport;

      if (viewport) map.fitBounds(viewport);
      onSelect(position, name, address, viewport);
    });
  }, [autocomplete]);

  return (
    <div className="form-control top-1.5 left-1.5 absolute flex items-center">
      <div className="input-group">
        <input
          type="text"
          placeholder="Type address here..."
          className="input input-bordered"
          ref={inputRef}
        />
      </div>
    </div>
  );
};

export default SearchBar;
