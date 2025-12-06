import { redirect } from "next/navigation";
import { getBookingDetails } from "@/data";
import { PaymentForm } from "./PaymentForm";
import { Suspense } from "react";

export default async function PaymentPage({
  params,
  searchParams,
}: {
  params: Promise<{ tripId: string }>;
  searchParams: Promise<{ bookingId?: string }>;
}) {
  const [{ tripId }, { bookingId }] = await Promise.all([params, searchParams]);

  const tripIdNum = Number(tripId);
  const bookingIdNum = Number(bookingId);

  // Redirect to trip page if invalid params or booking not found
  if (!bookingId || isNaN(tripIdNum) || isNaN(bookingIdNum)) {
    redirect(`/trip/${tripId}`);
    // todo set param for flash message
  }

  const bookingDetailsPromise = getBookingDetails(tripIdNum, bookingIdNum);

  return (
    <Suspense fallback={<PaymentLoading />}>
      <PaymentContent
        bookingDetailsPromise={bookingDetailsPromise}
        tripId={tripId}
      />
    </Suspense>
  );
}

async function PaymentContent({
  bookingDetailsPromise,
  tripId,
}: {
  bookingDetailsPromise: ReturnType<typeof getBookingDetails>;
  tripId: string;
}) {
  const bookingDetails = await bookingDetailsPromise;

  if (!bookingDetails) {
    redirect(`/trip/${tripId}`);
  }

  const { booking, trip, seats, user } = bookingDetails;

  return (
    <div className="flex max-w-3xl flex-col items-center">
      <h1 className="mb-2 text-2xl font-bold">Payment</h1>

      {/* Reservation Timer */}
      {booking.status === "reserved" && booking.reservedUntil && (
        <div className="mb-4 flex flex-col items-center text-sm">
          <p className="font-medium text-stone-800">
            Reservation expires at{" "}
            {new Date(booking.reservedUntil).toLocaleTimeString()}
          </p>
          <p className="text-stone-600">
            Complete payment to confirm your booking
          </p>
        </div>
      )}

      {/* Trip Info Section */}
      <h2 className="mb-3 w-full text-left text-lg font-medium">
        Trip Information
      </h2>
      <section className="mb-6 w-lg rounded-lg border border-stone-200 bg-stone-50 p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-lg font-semibold">
            {trip.origin.abbreviation} → {trip.destination.abbreviation}
          </div>
          <div className="text-right text-lg font-semibold">
            ${trip.cost} per seat
          </div>
        </div>

        <div className="mb-2">
          <div className="text-stone-600">{trip.date}</div>
          <div className="text-sm text-stone-600">
            Departure: {trip.departureTime} | Arrival: {trip.arrivalTime}
          </div>
        </div>

        <div className="mt-3 border-t border-stone-200 pt-3">
          <div className="mb-1 text-sm font-medium text-stone-700">
            Selected Seats:
          </div>
          <div className="text-sm text-stone-600">{seats.join(", ")}</div>
        </div>

        <div className="mt-3 border-t border-stone-200 pt-3">
          <div className="flex justify-between">
            <span className="font-medium">Total Amount:</span>
            <span className="text-lg font-bold">${booking.amount}</span>
          </div>
        </div>
      </section>

      {/* User Info Section */}
      <h2 className="mb-3 w-full text-left text-lg font-medium">
        Passenger Information
      </h2>
      <section className="mb-6 w-lg rounded-lg border border-stone-200 bg-stone-50 p-4">
        <div className="space-y-2 text-sm">
          <div>
            <span className="font-medium">Name:</span> {user.name}
          </div>
          <div>
            <span className="font-medium">Email:</span> {user.email}
          </div>
        </div>
      </section>

      {/* Payment Form Section */}
      <PaymentForm
        bookingId={booking.id}
        tripId={Number(tripId)}
        amount={booking.amount}
      />
    </div>
  );
}

function PaymentLoading() {
  return (
    <div className="flex max-w-3xl animate-pulse flex-col items-center">
      {/* Title */}
      <h1 className="mb-2 h-8 w-32 rounded bg-stone-300" />

      {/* Reservation Timer */}
      <div className="mb-4 flex flex-col items-center gap-1">
        <div className="h-5 w-64 rounded bg-stone-300" />
        <div className="h-5 w-56 rounded bg-stone-300" />
      </div>

      {/* Trip Info Section Title */}
      <h2 className="mb-3 h-7 w-full rounded bg-stone-300" />

      {/* Trip Info Section */}
      <section className="mb-6 w-lg rounded-lg border border-stone-200 bg-stone-50 p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="h-7 w-32 rounded bg-stone-300" />
          <div className="h-7 w-28 rounded bg-stone-300" />
        </div>

        <div className="mb-2 space-y-2">
          <div className="h-6 w-24 rounded bg-stone-300" />
          <div className="h-5 w-64 rounded bg-stone-300" />
        </div>

        <div className="mt-3 border-t border-stone-200 pt-3">
          <div className="mb-1 h-5 w-28 rounded bg-stone-300" />
          <div className="h-5 w-20 rounded bg-stone-300" />
        </div>

        <div className="mt-3 border-t border-stone-200 pt-3">
          <div className="flex justify-between">
            <div className="h-6 w-28 rounded bg-stone-300" />
            <div className="h-7 w-16 rounded bg-stone-300" />
          </div>
        </div>
      </section>

      {/* Passenger Info Section Title */}
      <h2 className="mb-3 h-7 w-full rounded bg-stone-300" />

      {/* Passenger Info Section */}
      <section className="mb-6 w-lg rounded-lg border border-stone-200 bg-stone-50 p-4">
        <div className="space-y-2">
          <div className="h-5 w-48 rounded bg-stone-300" />
          <div className="h-5 w-56 rounded bg-stone-300" />
        </div>
      </section>

      {/* Payment Form Section Title */}
      <h2 className="mb-4 h-7 w-full rounded bg-stone-300" />

      {/* Payment Form */}
      <section className="w-lg">
        <div className="space-y-4">
          {/* Cardholder Name */}
          <div>
            <div className="mb-1 h-5 w-32 rounded bg-stone-300" />
            <div className="h-10 w-full rounded-md bg-stone-300" />
          </div>

          {/* Card Number */}
          <div>
            <div className="mb-1 h-5 w-24 rounded bg-stone-300" />
            <div className="h-10 w-full rounded-md bg-stone-300" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Expiry */}
            <div>
              <div className="mb-1 h-5 w-20 rounded bg-stone-300" />
              <div className="h-10 w-full rounded-md bg-stone-300" />
            </div>

            {/* CVV */}
            <div>
              <div className="mb-1 h-5 w-12 rounded bg-stone-300" />
              <div className="h-10 w-full rounded-md bg-stone-300" />
            </div>
          </div>

          {/* Billing Address */}
          <div>
            <div className="mb-1 h-5 w-28 rounded bg-stone-300" />
            <div className="h-10 w-full rounded-md bg-stone-300" />
          </div>

          {/* Card Type */}
          <div>
            <div className="mb-1 h-5 w-20 rounded bg-stone-300" />
            <div className="h-10 w-full rounded-md bg-stone-300" />
          </div>

          {/* Submit Button */}
          <div className="h-10 w-full rounded-md bg-stone-300" />
        </div>
      </section>
    </div>
  );
}
