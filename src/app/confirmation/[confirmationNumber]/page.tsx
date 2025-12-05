export default async function ConfirmationPage({
  params,
}: {
  params: { confirmationNumber: string };
}) {
  const { confirmationNumber } = await params;
  return (
    <div className="">
      <h1 className="mb-4 text-2xl font-bold">Booking Confirmed</h1>
      <p className="mb-6 text-sm text-stone-800">
        Confirmation Number: {confirmationNumber}
      </p>

      <section className="w-full">
        <h2 className="mb-3 text-xl font-semibold">Thank You</h2>
        <p className="mb-4">Your booking has been confirmed successfully.</p>
        <p className="text-sm text-gray-600">
          You will receive a confirmation email shortly with your trip details.
        </p>
      </section>
    </div>
  );
}
