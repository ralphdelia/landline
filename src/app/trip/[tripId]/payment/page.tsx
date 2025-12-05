export default function PaymentPage({
  params,
}: {
  params: { tripId: string };
}) {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center font-sans">
      <main className="bg-background flex min-h-screen w-full max-w-3xl flex-col items-center sm:items-start p-8">
        <h1 className="text-2xl font-bold mb-4">Payment</h1>
        <p className="text-sm text-gray-500 mb-6">Trip ID: {params.tripId}</p>
        
        <section className="w-full">
          <h2 className="text-xl font-semibold mb-3">Responsibilities</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Handles payment for the reserved booking</li>
          </ul>
        </section>
      </main>
    </div>
  );
}
