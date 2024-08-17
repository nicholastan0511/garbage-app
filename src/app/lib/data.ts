import { sql } from "@vercel/postgres";
import axios from "axios";

export const fetchAllGarbageData = async () => {
  try {
    console.log("Fetching locations...");
    const data = await sql`SELECT * FROM locations`;
    console.log("All locations fetched.");

    return data.rows;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch location data.");
  }
};

export const fetchUserLocality = async (
  userLocation: google.maps.LatLngLiteral
) => {
  const { lat, lng } = userLocation;
  if (!lat || !lng) return;

  const locality = await axios.get(
    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
  );

  return locality.data;
};
