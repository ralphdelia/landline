"use server";

import { db } from "@/db";
import { users, bookings, bookingSeats, seats, trips } from "@/db/schema";
import { bookingFormSchema, paymentFormSchema } from "@/types";
import { eq, and, inArray } from "drizzle-orm";
import { redirect } from "next/navigation";
import { z } from "zod";
import { generateConfirmationNumber } from "@/app/utils";

type FormActionState = {
  errors: string[];
  properties?: Record<string, { errors: string[] }>;
};

class BookingTransactionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BookingTransactionError";
  }
}

class PaymentTransactionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PaymentTransactionError";
  }
}

export async function createBooking(
  _prevState: FormActionState,
  formData: FormData
) {
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

  let booking;
  try {
    booking = await db.transaction(async (tx) => {
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

      const seatRecords = await tx
        .select({
          id: seats.id,
          seatNumber: seats.seatNumber,
        })
        .from(seats)
        .where(
          and(
            eq(seats.tripId, tripIdNum),
            inArray(seats.seatNumber, validatedData.seats)
          )
        )
        .for("update"); //locks these rows until transaction completes

      if (seatRecords.length !== validatedData.seats.length) {
        throw new BookingTransactionError("Some selected seats do not exist");
      }

      // Then check if any are already booked
      const seatIds = seatRecords.map((s) => s.id);
      const bookedSeatsCheck = await tx
        .select({
          seatId: bookingSeats.seatId,
          bookingId: bookingSeats.bookingId,
        })
        .from(bookingSeats)
        .where(inArray(bookingSeats.seatId, seatIds));

      if (bookedSeatsCheck.length > 0) {
        throw new BookingTransactionError(
          "One or more seats are already booked"
        );
      }

      const trip = await tx.query.trips.findFirst({
        where: eq(trips.id, tripIdNum),
      });

      if (!trip) {
        throw new BookingTransactionError("Trip not found");
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

      await tx.insert(bookingSeats).values(
        seatIds.map((seatId) => ({
          bookingId: newBooking.id,
          seatId,
        }))
      );

      return newBooking;
    });
  } catch (error) {
    console.error("Booking error:", error);
    return {
      errors: [
        error instanceof BookingTransactionError
          ? error.message
          : "Failed to create booking",
      ],
    };
  }

  // Redirect to payment page on success
  redirect(`/trip/${tripIdNum}/payment?bookingId=${booking.id}`);
}

export async function processPayment(
  _prevState: FormActionState,
  formData: FormData
) {
  const validation = paymentFormSchema.safeParse({
    bookingId: formData.get("bookingId"),
    cardholderName: formData.get("cardholderName") as string,
    cardNumber: formData.get("cardNumber") as string,
    expiryDate: formData.get("expiryDate") as string,
    cvv: formData.get("cvv") as string,
    billingAddress: formData.get("billingAddress") as string,
    paymentMethodType: formData.get("paymentMethodType") as string,
    tripId: formData.get("tripId"),
  });

  if (!validation.success) {
    return z.treeifyError(validation.error);
  }

  const validatedData = validation.data;

  if (!validatedData.tripId) {
    return {
      errors: ["Invalid trip ID"],
    };
  }

  let result;
  try {
    result = await db.transaction(async (tx) => {
      const [booking] = await tx
        .select()
        .from(bookings)
        .where(eq(bookings.id, validatedData.bookingId))
        .for("update"); // lock booking row during transaction

      if (!booking) {
        throw new PaymentTransactionError("Booking not found");
      }

      if (booking.status === "booked") {
        throw new PaymentTransactionError("Booking has already been purchased");
      }

      if (booking.status !== "reserved") {
        throw new PaymentTransactionError("Booking is not in reserved status");
      }

      if (booking.reservedUntil && new Date() > booking.reservedUntil) {
        throw new PaymentTransactionError("Reservation has expired");
      }

      /* MOCK Process payment */
      const confirmationNumber = generateConfirmationNumber();

      await tx
        .update(bookings)
        .set({
          status: "booked",
          confirmationNumber,
          reservedUntil: null,
        })
        .where(eq(bookings.id, validatedData.bookingId));

      const last4 = validatedData.cardNumber.replace(/\s/g, "").slice(-4);
      await tx
        .update(users)
        .set({
          billingAddress: validatedData.billingAddress,
          paymentMethodType: validatedData.paymentMethodType,
          paymentMethodLast4: last4,
        })
        .where(eq(users.id, booking.userId));

      return { confirmationNumber, tripId: validatedData.tripId };
    });
  } catch (error) {
    console.error("Payment error:", error);
    return {
      errors: [
        error instanceof PaymentTransactionError
          ? error.message
          : "Failed to process payment",
      ],
    };
  }

  redirect(`/confirmation/${result.confirmationNumber}`);
}
