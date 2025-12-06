export default function PaymentLoading() {
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
