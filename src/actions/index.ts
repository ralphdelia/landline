"use server";

import { db } from "@/db";
import { users, bookings, bookingSeats, seats, trips } from "@/db/schema";
import { bookingFormSchema } from "@/types";
import { eq, and, inArray } from "drizzle-orm";
import { redirect } from "next/navigation";
import { z } from "zod";

export type BookingState =
  | {
      errors: string[];
      properties?: {
        seats?: {
          errors: string[];
        };
        name?: {
          errors: string[];
        };
        email?: {
          errors: string[];
        };
        dateOfBirth?: {
          errors: string[];
        };
      };
    }
  | {
      _form: string[];
    }
  | Record<string, never>;

export async function createBooking(
  _prevState: BookingState,
  formData: FormData
): Promise<BookingState> {
  const rawData = {
    seats: formData.getAll("seats") as string[],
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    dateOfBirth: formData.get("dateOfBirth") as string,
  };

  const tripId = formData.get("tripId");
  if (!tripId || isNaN(Number(tripId))) {
    redirect("/");
  }

  const tripIdNum = Number(tripId);
  const validation = bookingFormSchema.safeParse(rawData);

  if (!validation.success) {
    return z.treeifyError(validation.error);
  }

  const validatedData = validation.data;

  try {
    // Execute transaction
    const booking = await db.transaction(async (tx) => {
      // 1. Check if user exists by email, if not create one
      let user = await tx.query.users.findFirst({
        where: eq(users.email, validatedData.email),
      });

      if (!user) {
        const [newUser] = await tx
          .insert(users)
          .values({
            name: validatedData.name,
            email: validatedData.email,
            dateOfBirth: validatedData.dateOfBirth,
          })
          .returning();
        user = newUser;
      }

      // 2. Get seat IDs and validate they exist and are available
      const seatRecords = await tx
        .select({
          id: seats.id,
          seatNumber: seats.seatNumber,
          bookingId: bookingSeats.bookingId,
        })
        .from(seats)
        .leftJoin(bookingSeats, eq(seats.id, bookingSeats.seatId))
        .where(
          and(
            eq(seats.tripId, tripIdNum),
            inArray(seats.seatNumber, validatedData.seats)
          )
        );

      if (seatRecords.length !== validatedData.seats.length) {
        throw new Error("Some selected seats do not exist");
      }

      const bookedSeat = seatRecords.find((s) => s.bookingId !== null);
      if (bookedSeat) {
        throw new Error("One or more seats are already booked");
      }

      const seatIds = seatRecords.map((s) => s.id);

      // 4. Get trip cost for calculating total amount
      const trip = await tx.query.trips.findFirst({
        where: eq(trips.id, tripIdNum),
      });

      if (!trip) {
        throw new Error("Trip not found");
      }

      const totalAmount = Number(trip.cost) * validatedData.seats.length;
      const reservedUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes from now

      const [newBooking] = await tx
        .insert(bookings)
        .values({
          userId: user.id,
          status: "reserved",
          reservedUntil,
          amount: totalAmount.toFixed(2),
        })
        .returning();

      // 7. Link all selected seats to the booking
      await tx.insert(bookingSeats).values(
        seatIds.map((seatId) => ({
          bookingId: newBooking.id,
          seatId,
        }))
      );

      return newBooking;
    });

    // Redirect to payment page on success
    redirect(`/trip/${tripIdNum}/payment?bookingId=${booking.id}`);
  } catch (error) {
    console.error("Booking error:", error);
    return {
      _form: [
        error instanceof Error ? error.message : "Failed to create booking",
      ],
    };
  }
}
