import { db } from "@vercel/postgres";
import csv from "csv-parser";
import fs from "fs";
import path from "path";
import { GarbageLocation } from "../lib/definitions";

const client = await db.connect();

const seedLocations = async () => {
  // Create table for locations
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await client.sql`
          CREATE TABLE IF NOT EXISTS locations (
              id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
              district TEXT NOT NULL,
              location TEXT NOT NULL,
              long NUMERIC NOT NULL,
              lat NUMERIC NOT NULL
          )
        `;

  // Path to garbage.csv
  const filePath = path.join(process.cwd(), "data", "garbage-trimmed.csv");

  const garbageData: GarbageLocation[] = [];
  let insertedLocations;

  // Insert each row on csv file to Postgres
  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (row: GarbageLocation) => {
      garbageData.push(row);
    })
    .on("end", async () => {
      console.log("CSV file successfully processed.");
      console.log(garbageData[2]);

      // proceed to insert data once the array has been seeded
      insertedLocations = await Promise.all(
        garbageData.map(async (location) => {
          return await client.sql`
            INSERT INTO locations (district, location, long, lat)
            VALUES (${location.district}, ${location.location}, ${location.long}, ${location.lat})
          `;
        })
      );
    })
    .on("error", (error) => {
      console.error("Error reading the CSV file:", error);
    });

  console.log(insertedLocations);

  return insertedLocations;
};

export const GET = async () => {
  return Response.json({ message: "Data has been seeded previously" });

  try {
    await client.sql`BEGIN`;
    await seedLocations();
    await client.sql`COMMIT`;

    return Response.json({ message: "Database seeded successfully" });
  } catch (error) {
    await client.sql`ROLLBACK`;
    return Response.json({ error }, { status: 500 });
  }
};
