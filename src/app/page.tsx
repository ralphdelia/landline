export default async function Home() {
  return (
    <section className="w-full">
      <h1 className="text-2xl font-bold mb-4">Search for a Trip</h1>
      <ul className="list-disc list-inside space-y-2">
        <li>User selects origin, destination, date</li>
        <li>Requires all fields before showing results</li>
        <li>Query params: from, to, date</li>
      </ul>
    </section>
  );
}
