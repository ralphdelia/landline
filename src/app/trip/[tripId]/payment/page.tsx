import { redirect } from "next/navigation";
import { getBookingDetails } from "@/data";
import { PaymentForm } from "./PaymentForm";

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

  const bookingDetails = await getBookingDetails(tripIdNum, bookingIdNum);

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
        tripId={tripIdNum}
        amount={booking.amount}
      />
    </div>
  );
}
