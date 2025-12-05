import { getOriginsWithDestinations, getTripsByRoute } from "@/data";
import { TripSearchForm } from "@/components/TripSearchForm";
import { SearchResultsList } from "@/components/SearchResultsList";
import { tripSearchSchema } from "@/types";
import { Suspense } from "react";

type Props = {
  searchParams: Promise<{
    from?: string;
    to?: string;
    date?: string;
  }>;
};

export default async function Home({ searchParams }: Props) {
  const origins = await getOriginsWithDestinations();
  const params = await searchParams;

  const parsedSearchParams = tripSearchSchema.safeParse(params);
  let searchResultsPromise;

  if (parsedSearchParams.success) {
    searchResultsPromise = getTripsByRoute(
      parsedSearchParams.data.from,
      parsedSearchParams.data.to,
      parsedSearchParams.data.date
    );
  }

  return (
    <section className="w-full overflow-hidden">
      <h1 className="mb-4 text-2xl font-bold">Search for a Trip</h1>
      <TripSearchForm origins={origins} />

      <Suspense fallback={<div className="mt-8">Loading results...</div>}>
        <SearchResultsList searchResultPromise={searchResultsPromise} />
      </Suspense>
    </section>
  );
}
