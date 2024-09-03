"use client";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

const Menu = ({
  localities,
  defaultValue,
  userLocality,
}: {
  localities: { [key: string]: string };
  defaultValue: string | undefined;
  userLocality: string | undefined;
}) => {
  const districts = Object.entries(localities);
  const { replace } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSelect = (selectedDistrict: string) => {
    const params = new URLSearchParams(searchParams);
    if (selectedDistrict === "option") return;
    params.set("district", selectedDistrict);
    replace(`${pathname}?${params.toString()}`);
  };

  let userLocation;
  if (userLocality) {
    userLocation = localities[userLocality];
  }

  console.log(userLocation);

  return (
    <div className="mt-3">
      <select
        name="districts"
        id="districts"
        className="text-black bg-white outline-none rounded-xl border-solid border-4 hover:cursor-pointer  font-light p-3"
        onChange={({ target }) => handleSelect(target.value)}
        defaultValue={
          !defaultValue
            ? userLocation
            : !defaultValue && !userLocation
            ? "option"
            : defaultValue
        }
      >
        <option value="option" disabled>
          Choose a district
        </option>
        {districts.map((district) => (
          <option value={district[1]} key={district[0]}>
            {district[0]}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Menu;
