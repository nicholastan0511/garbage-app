"use client";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

const Menu = ({
  localities,
  defaultValue,
}: {
  localities: { [key: string]: string };
  defaultValue: string | undefined;
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

  return (
    <div>
      {/* <label htmlFor="districts">Choose a district</label> */}
      <select
        name="districts"
        id="districts"
        className="text-black bg-white outline-none rounded-xl border-solid border-4 hover:cursor-pointer  font-light p-3"
        onChange={({ target }) => handleSelect(target.value)}
        defaultValue={defaultValue || "option"}
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
