import "dotenv/config";
import { db } from "../db";
import { locations, routes, trips, seats } from "../db/schema";

async function seed() {
  console.log("🌱 Seeding database...");

  try {
    // Check if database is already seeded
    const existingLocations = await db.select().from(locations).limit(1);
    if (existingLocations.length > 0) {
      console.log(
        "⚠️  Database already contains data. Please run 'pnpm db:reset' first if you want to re-seed."
      );
      return;
    }

    // Seed locations
    console.log("📍 Seeding locations...");
    const locationData = [
      {
        name: "Newark Liberty International Airport",
        abbreviation: "EWR",
        city: "Newark",
        country: "USA",
      },
      {
        name: "LaGuardia Airport",
        abbreviation: "LGA",
        city: "New York",
        country: "USA",
      },
      {
        name: "John F. Kennedy International Airport",
        abbreviation: "JFK",
        city: "New York",
        country: "USA",
      },
      {
        name: "Buffalo Niagara International Airport",
        abbreviation: "BUF",
        city: "Buffalo",
        country: "USA",
      },
      {
        name: "Boston Logan International Airport",
        abbreviation: "BOS",
        city: "Boston",
        country: "USA",
      },
      {
        name: "Philadelphia International Airport",
        abbreviation: "PHL",
        city: "Philadelphia",
        country: "USA",
      },
      {
        name: "Baltimore Washington International Airport",
        abbreviation: "BWI",
        city: "Baltimore",
        country: "USA",
      },
      {
        name: "Ronald Reagan Washington National Airport",
        abbreviation: "DCA",
        city: "Washington",
        country: "USA",
      },
      {
        name: "Washington Dulles International Airport",
        abbreviation: "IAD",
        city: "Washington",
        country: "USA",
      },
    ];

    const insertedLocations = await db
      .insert(locations)
      .values(locationData)
      .returning();
    console.log(`✓ Seeded ${insertedLocations.length} locations`);

    // Create location map by abbreviation for easy lookup
    const locationMap = new Map(
      insertedLocations.map((loc) => [loc.abbreviation, loc.id])
    );

    // Seed routes
    console.log("🛣️  Seeding routes...");
    const graphConnections: Record<string, string[]> = {
      EWR: ["LGA", "JFK", "BUF", "BOS", "PHL", "BWI", "DCA", "IAD"],
      LGA: ["EWR", "JFK", "BUF", "BOS", "PHL", "BWI", "DCA", "IAD"],
      JFK: ["EWR", "LGA", "BUF", "BOS", "PHL", "BWI", "DCA", "IAD"],
      BUF: ["EWR", "LGA", "JFK", "BOS", "PHL", "BWI", "DCA", "IAD"],
      BOS: ["EWR", "LGA", "JFK", "BUF", "PHL", "BWI", "DCA", "IAD"],
      PHL: ["EWR", "LGA", "JFK", "BUF", "BOS", "BWI", "DCA", "IAD"],
      BWI: ["EWR", "LGA", "JFK", "BUF", "BOS", "PHL", "DCA", "IAD"],
      DCA: ["EWR", "LGA", "JFK", "BUF", "BOS", "PHL", "BWI", "IAD"],
      IAD: ["EWR", "LGA", "JFK", "BUF", "BOS", "PHL", "BWI", "DCA"],
    };

    const routeData = [];
    for (const [origin, destinations] of Object.entries(graphConnections)) {
      const originId = locationMap.get(origin);
      if (!originId) continue;

      for (const destination of destinations) {
        const destinationId = locationMap.get(destination);
        if (!destinationId) continue;

        routeData.push({
          originLocationId: originId,
          destinationLocationId: destinationId,
        });
      }
    }

    const insertedRoutes = await db
      .insert(routes)
      .values(routeData)
      .returning();
    console.log(`✓ Seeded ${insertedRoutes.length} routes`);

    // Seed trips
    console.log("✈️  Seeding trips...");
    const tripSchedules = [
      { departure: "06:00", arrival: "07:30" },
      { departure: "08:00", arrival: "09:30" },
      { departure: "10:00", arrival: "11:30" },
      { departure: "12:00", arrival: "13:30" },
      { departure: "14:00", arrival: "15:30" },
      { departure: "16:00", arrival: "17:30" },
    ];

    // Generate dates from Dec 6, 2025 to Jan 6, 2026
    const startDate = new Date("2025-12-06");
    const endDate = new Date("2026-01-06");
    const dates: string[] = [];

    for (
      let date = new Date(startDate);
      date <= endDate;
      date.setDate(date.getDate() + 1)
    ) {
      dates.push(date.toISOString().split("T")[0]);
    }

    const tripData = [];
    for (const route of insertedRoutes) {
      for (const date of dates) {
        for (const schedule of tripSchedules) {
          tripData.push({
            routeId: route.id,
            cost: "49.99", // Default cost
            date,
            departureTime: schedule.departure,
            arrivalTime: schedule.arrival,
          });
        }
      }
    }

    // Insert trips in batches to avoid parameter limit
    const tripBatchSize = 500;
    const insertedTrips = [];
    for (let i = 0; i < tripData.length; i += tripBatchSize) {
      const batch = tripData.slice(i, i + tripBatchSize);
      const batchResult = await db.insert(trips).values(batch).returning();
      insertedTrips.push(...batchResult);
      console.log(`  ✓ Seeded ${insertedTrips.length} / ${tripData.length} trips`);
    }
    console.log(`✓ Seeded ${insertedTrips.length} trips`);

    // Seed seats
    console.log("💺 Seeding seats...");
    const seatNumbers = [
      "A1",
      "A2",
      "A3",
      "A4",
      "B1",
      "B2",
      "B3",
      "B4",
      "C1",
      "C2",
      "C3",
      "C4",
      "D1",
      "D2",
      "D3",
      "D4",
      "E1",
      "E2",
      "E3",
      "E4",
      "F1",
      "F2",
      "F3",
      "F4",
      "G1",
      "G2",
      "G3",
      "G4",
      "H1",
      "H2",
      "H3",
      "H4",
      "I1",
      "I2",
      "I3",
      "I4",
      "J1",
      "J2",
      "J3",
      "J4",
      "K1",
      "K2",
      "K3",
      "K4",
      "L1",
      "L2",
      "L3",
      "L4",
    ];

    const seatData = [];
    for (const trip of insertedTrips) {
      for (const seatNumber of seatNumbers) {
        seatData.push({
          tripId: trip.id,
          seatNumber,
        });
      }
    }

    // Insert seats in batches to avoid overwhelming the database
    const batchSize = 1000;
    let totalSeats = 0;
    for (let i = 0; i < seatData.length; i += batchSize) {
      const batch = seatData.slice(i, i + batchSize);
      await db.insert(seats).values(batch);
      totalSeats += batch.length;
      console.log(`  ✓ Seeded ${totalSeats} / ${seatData.length} seats`);
    }

    console.log("✅ Database seeding complete!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

seed()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .then(() => {
    process.exit(0);
  });
