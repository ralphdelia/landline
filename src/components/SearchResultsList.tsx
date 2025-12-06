import type { TripWithAvailability } from "@/types";
import Link from "next/link";
import { formatTime } from "@/utils";

type Props = {
  searchResultPromise: Promise<TripWithAvailability[]> | undefined;
};

export async function SearchResultsList({ searchResultPromise }: Props) {
  if (!searchResultPromise) {
    return null;
  }

  const trips = await searchResultPromise;

  if (trips.length === 0) {
    return (
      <div className="mt-8">
        <h2 className="mb-4 text-xl font-semibold">Search Results</h2>
        <p className="text-gray-600">
          No trips found for the selected route and date. Seed data has been
          provided for trips scheduled between December 6 and January 6.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <section className="py-4">
        <h2 className="mb-2 text-xl font-semibold text-stone-800">
          {trips[0].origin.name} → {trips[0].destination.name}
        </h2>
        <p className="text-stone-700">
          {trips.length} available trips on {trips[0].date}
        </p>
      </section>

      <ul className="space-y-1">
        {trips.map((trip) => (
          <li key={trip.id}>
            <Link
              href={`trip/${trip.id}`}
              className="block rounded-lg p-2 hover:bg-stone-300/50"
            >
              <div className="flex items-center justify-between pt-1">
                <div className="flex gap-6">
                  <div>
                    <p className="text-xs text-gray-500">Departure</p>
                    <p className="font-medium">
                      {formatTime(trip.departureTime)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Arrival</p>
                    <p className="font-medium">
                      {formatTime(trip.arrivalTime)}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Availability</p>
                  <p className={`font-medium`}>
                    {trip.availableSeats} / {trip.totalSeats} seats
                  </p>
                </div>

                <div className="text-left">
                  <p className="text-xs text-gray-500">Price</p>
                  <div className="mt-2">
                    <p className="font-medium">${trip.cost}</p>
                  </div>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
