export default function ConfirmationPage({
  params,
}: {
  params: { confirmationNumber: string };
}) {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center font-sans">
      <main className="bg-background flex min-h-screen w-full max-w-3xl flex-col items-center p-8 sm:items-start">
        <h1 className="mb-4 text-2xl font-bold">Booking Confirmed</h1>
        <p className="mb-6 text-sm text-gray-500">
          Confirmation Number: {params.confirmationNumber}
        </p>

        <section className="w-full">
          <h2 className="mb-3 text-xl font-semibold">Thank You</h2>
          <p className="mb-4">Your booking has been confirmed successfully.</p>
          <p className="text-sm text-gray-600">
            You will receive a confirmation email shortly with your trip
            details.
          </p>
        </section>
      </main>
    </div>
  );
}
