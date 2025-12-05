import { db } from "@/db";
import { eq } from "drizzle-orm";
import { trips } from "@/db/schema";
import type { OriginWithDestinations } from "@/types";

export async function getOriginsWithDestinations() {
  // Get all routes with their origin and destination locations
  const allRoutes = await db.query.routes.findMany({
    with: {
      originLocation: true,
      destinationLocation: true,
    },
  });

  // Group by origin
  const originsMap = new Map<number, OriginWithDestinations>();

  for (const route of allRoutes) {
    if (!originsMap.has(route.originLocation.id)) {
      originsMap.set(route.originLocation.id, {
        id: route.originLocation.id,
        name: route.originLocation.name,
        abbreviation: route.originLocation.abbreviation,
        destinations: [],
      });
    }

    const origin = originsMap.get(route.originLocation.id)!;
    origin.destinations.push({
      id: route.destinationLocation.id,
      name: route.destinationLocation.name,
      abbreviation: route.destinationLocation.abbreviation,
    });
  }

  return Array.from(originsMap.values());
}

export async function getTripsByRoute(
  fromAbbr: string,
  toAbbr: string,
  date: string
) {
  // Find the route that matches from and to
  const tripsData = await db.query.trips.findMany({
    where: eq(trips.date, date),
    with: {
      route: {
        with: {
          originLocation: true,
          destinationLocation: true,
        },
      },
      seats: {
        with: {
          bookingSeats: true,
        },
      },
    },
  });

  type TripData = (typeof tripsData)[number];
  type SeatData = TripData["seats"][number];

  // Filter trips by route origin and destination
  const filteredTrips = tripsData.filter((trip: TripData) => {
    return (
      trip.route.originLocation.abbreviation === fromAbbr &&
      trip.route.destinationLocation.abbreviation === toAbbr
    );
  });

  // Calculate availability for each trip
  return filteredTrips.map((trip: TripData) => {
    const totalSeats = trip.seats.length;
    const bookedSeats = trip.seats.filter((seat: SeatData) => {
      return seat.bookingSeats.length > 0;
    }).length;
    const availableSeats = totalSeats - bookedSeats;

    return {
      id: trip.id,
      date: trip.date,
      departureTime: trip.departureTime,
      arrivalTime: trip.arrivalTime,
      cost: trip.cost,
      origin: {
        id: trip.route.originLocation.id,
        name: trip.route.originLocation.name,
        abbreviation: trip.route.originLocation.abbreviation,
      },
      destination: {
        id: trip.route.destinationLocation.id,
        name: trip.route.destinationLocation.name,
        abbreviation: trip.route.destinationLocation.abbreviation,
      },
      totalSeats,
      availableSeats,
      bookedSeats,
    };
  });
}
