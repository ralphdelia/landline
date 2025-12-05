"use client";

import React, { use, useState } from "react";
import { bookingFormSchema, type BookingFormData } from "@/types";
import { Button } from "@/components/ui";
import type { getTripById } from "@/data";
import { notFound } from "next/navigation";

type TripDetailClientProps = {
  tripPromise: NonNullable<ReturnType<typeof getTripById>>;
};
const COLS_PER_ROW = 4;

export function TripDetailClient({ tripPromise }: TripDetailClientProps) {
  const trip = use(tripPromise);
  const [errors, setErrors] = useState<
    Partial<Record<keyof BookingFormData, string>>
  >({});

  if (!trip) return notFound();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const result = bookingFormSchema.safeParse({
      seats: formData.getAll("seats") as string[],
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      dateOfBirth: formData.get("dateOfBirth") as string,
    });

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof BookingFormData, string>> = {};
      result.error.issues.forEach((err) => {
        const field = err.path[0] as keyof BookingFormData;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});

    // TODO: Navigate to checkout or process booking
    console.log("Booking data:", result.data);
  };

  return (
    <div className="">
      <h1 className="mb-4 text-2xl font-medium">Trip Detail</h1>

      {/* Trip Info */}
      <section className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
        <div className="mb-2 flex items-center justify-between">
          <div className="text-lg font-semibold">
            {trip.origin.abbreviation} → {trip.destination.abbreviation}
          </div>
          <div className="text-right text-lg font-semibold">
            ${trip.cost} per seat
          </div>
        </div>
        <div>
          <div className="text-gray-600">{trip.date}</div>
          <div className="text-sm text-gray-600">
            Departure: {trip.departureTime} | Arrival: {trip.arrivalTime}
          </div>
        </div>
      </section>

      <section className="mb-25">
        <form onSubmit={handleSubmit}>
          <h3 className="mb-4 text-xl font-medium">Seat Selection</h3>
          <div className="flex justify-center">
            <div className="w-sm">
              <div className="grid grid-cols-[auto_auto_1.5rem_auto_auto] items-center gap-x-4 gap-y-2">
                {/* Rows with seats - chunk seats into rows of 4 */}
                {Array.from(
                  { length: Math.ceil(trip.seats.length / COLS_PER_ROW) },
                  (_, rowIndex) => {
                    const rowSeats = trip.seats.slice(
                      rowIndex * COLS_PER_ROW,
                      (rowIndex + 1) * COLS_PER_ROW
                    );

                    return (
                      <React.Fragment key={rowIndex}>
                        {/* First seat */}
                        {rowSeats[0] && (
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              name="seats"
                              value={rowSeats[0].seatNumber}
                              disabled={!rowSeats[0].isAvailable}
                              className="h-5 w-5 cursor-pointer accent-stone-600 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                            <span className="text-sm">
                              {rowSeats[0].seatNumber}
                            </span>
                          </label>
                        )}

                        {/* Second seat */}
                        {rowSeats[1] && (
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              name="seats"
                              value={rowSeats[1].seatNumber}
                              disabled={!rowSeats[1].isAvailable}
                              className="h-5 w-5 cursor-pointer accent-stone-600 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                            <span className="text-sm">
                              {rowSeats[1].seatNumber}
                            </span>
                          </label>
                        )}

                        {/* Middle gap (aisle) */}
                        <div></div>

                        {/* Third seat */}
                        {rowSeats[2] && (
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              name="seats"
                              value={rowSeats[2].seatNumber}
                              disabled={!rowSeats[2].isAvailable}
                              className="h-5 w-5 cursor-pointer accent-stone-600 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                            <span className="text-sm">
                              {rowSeats[2].seatNumber}
                            </span>
                          </label>
                        )}

                        {/* Fourth seat */}
                        {rowSeats[3] && (
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              name="seats"
                              value={rowSeats[3].seatNumber}
                              disabled={!rowSeats[3].isAvailable}
                              className="h-5 w-5 cursor-pointer accent-stone-600 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                            <span className="text-sm">
                              {rowSeats[3].seatNumber}
                            </span>
                          </label>
                        )}
                      </React.Fragment>
                    );
                  }
                )}
              </div>
              <div className="mt-0.5 h-4">
                {errors.seats && (
                  <p className="text-xs text-red-500">{errors.seats}</p>
                )}
              </div>
            </div>
          </div>

          <h3 className="mt-6 text-xl font-medium">User Info</h3>
          <div className="mt-3 mr-auto ml-auto flex w-md flex-col gap-3">
            <div className="w-full">
              <label htmlFor="name" className="mb-1 block text-sm font-medium">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                className={`w-full rounded-md border bg-stone-50 px-3 py-2 ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
              />
              <div className="mt-0.5 h-4">
                {errors.name && (
                  <p className="text-xs text-red-500">{errors.name}</p>
                )}
              </div>
            </div>

            <div className="w-full">
              <label htmlFor="email" className="mb-1 block text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className={`w-full rounded-md border bg-stone-50 px-3 py-2 ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              <div className="mt-0.5 h-4">
                {errors.email && (
                  <p className="text-xs text-red-500">{errors.email}</p>
                )}
              </div>
            </div>

            <div className="w-full">
              <label
                htmlFor="dateOfBirth"
                className="mb-1 block text-sm font-medium"
              >
                Date of birth
              </label>
              <input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                className={`w-full rounded-md border bg-stone-50 px-3 py-2 ${
                  errors.dateOfBirth ? "border-red-500" : "border-gray-300"
                }`}
              />
              <div className="mt-0.5 h-4">
                {errors.dateOfBirth && (
                  <p className="text-xs text-red-500">{errors.dateOfBirth}</p>
                )}
              </div>
            </div>

            <Button type="submit" className="mt-3">
              Continue to Checkout
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}
