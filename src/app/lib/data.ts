import { sql } from "@vercel/postgres";

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
