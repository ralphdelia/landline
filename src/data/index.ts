import { db } from "@/db";
import { eq, and, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { trips, routes, locations, seats, bookingSeats } from "@/db/schema";
import type { OriginWithDestinations } from "@/types";

export async function getOriginsWithDestinations() {
  const allRoutes = await db.query.routes.findMany({
    with: {
      originLocation: true,
      destinationLocation: true,
    },
  });

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
  const originLoc = alias(locations, "origin_loc");
  const destLoc = alias(locations, "destination_loc");

  const result = await db
    .select({
      id: trips.id,
      date: trips.date,
      departureTime: trips.departureTime,
      arrivalTime: trips.arrivalTime,
      cost: trips.cost,
      originId: originLoc.id,
      originName: originLoc.name,
      originAbbreviation: originLoc.abbreviation,
      destinationId: destLoc.id,
      destinationName: destLoc.name,
      destinationAbbreviation: destLoc.abbreviation,
      totalSeats: sql<number>`COUNT(DISTINCT ${seats.id})`.mapWith(Number),
      bookedSeats:
        sql<number>`COUNT(DISTINCT CASE WHEN ${bookingSeats.id} IS NOT NULL THEN ${seats.id} END)`.mapWith(
          Number
        ),
    })
    .from(trips)
    .innerJoin(routes, eq(trips.routeId, routes.id))
    .innerJoin(originLoc, eq(routes.originLocationId, originLoc.id))
    .innerJoin(destLoc, eq(routes.destinationLocationId, destLoc.id))
    .leftJoin(seats, eq(seats.tripId, trips.id))
    .leftJoin(bookingSeats, eq(bookingSeats.seatId, seats.id))
    .where(
      and(
        eq(trips.date, date),
        eq(originLoc.abbreviation, fromAbbr),
        eq(destLoc.abbreviation, toAbbr)
      )
    )
    .groupBy(
      trips.id,
      trips.date,
      trips.departureTime,
      trips.arrivalTime,
      trips.cost,
      originLoc.id,
      originLoc.name,
      originLoc.abbreviation,
      destLoc.id,
      destLoc.name,
      destLoc.abbreviation
    );

  return result.map((trip) => ({
    id: trip.id,
    date: trip.date,
    departureTime: trip.departureTime,
    arrivalTime: trip.arrivalTime,
    cost: trip.cost,
    origin: {
      id: trip.originId,
      name: trip.originName,
      abbreviation: trip.originAbbreviation,
    },
    destination: {
      id: trip.destinationId,
      name: trip.destinationName,
      abbreviation: trip.destinationAbbreviation,
    },
    totalSeats: trip.totalSeats,
    availableSeats: trip.totalSeats - trip.bookedSeats,
    bookedSeats: trip.bookedSeats,
  }));
}

export async function getTripById(tripId: number) {
  const originLoc = alias(locations, "origin_loc");
  const destLoc = alias(locations, "destination_loc");

  const [tripResult, seatsResult] = await Promise.all([
    db
      .select({
        id: trips.id,
        date: trips.date,
        departureTime: trips.departureTime,
        arrivalTime: trips.arrivalTime,
        cost: trips.cost,
        originId: originLoc.id,
        originName: originLoc.name,
        originAbbreviation: originLoc.abbreviation,
        originCity: originLoc.city,
        originCountry: originLoc.country,
        destinationId: destLoc.id,
        destinationName: destLoc.name,
        destinationAbbreviation: destLoc.abbreviation,
        destinationCity: destLoc.city,
        destinationCountry: destLoc.country,
      })
      .from(trips)
      .innerJoin(routes, eq(trips.routeId, routes.id))
      .innerJoin(originLoc, eq(routes.originLocationId, originLoc.id))
      .innerJoin(destLoc, eq(routes.destinationLocationId, destLoc.id))
      .where(eq(trips.id, tripId)),

    db
      .select({
        id: seats.id,
        seatNumber: seats.seatNumber,
        isAvailable: sql<boolean>`${bookingSeats.id} IS NULL`.mapWith(Boolean),
      })
      .from(seats)
      .leftJoin(bookingSeats, eq(bookingSeats.seatId, seats.id))
      .where(eq(seats.tripId, tripId))
      .orderBy(
        sql`SUBSTRING(${seats.seatNumber}, 1, 1)`,
        sql`CAST(SUBSTRING(${seats.seatNumber}, 2) AS INTEGER)`
      ),
  ]);

  if (tripResult.length === 0) {
    return null;
  }

  const tripInfo = tripResult[0];

  return {
    id: tripInfo.id,
    date: tripInfo.date,
    departureTime: tripInfo.departureTime,
    arrivalTime: tripInfo.arrivalTime,
    cost: tripInfo.cost,
    origin: {
      id: tripInfo.originId,
      name: tripInfo.originName,
      abbreviation: tripInfo.originAbbreviation,
      city: tripInfo.originCity,
      country: tripInfo.originCountry,
    },
    destination: {
      id: tripInfo.destinationId,
      name: tripInfo.destinationName,
      abbreviation: tripInfo.destinationAbbreviation,
      city: tripInfo.destinationCity,
      country: tripInfo.destinationCountry,
    },
    seats: seatsResult,
  };
}
