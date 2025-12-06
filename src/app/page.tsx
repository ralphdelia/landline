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
      <TripSearchForm origins={origins} initialValues={params} />

      <Suspense fallback={<SearchResultsLoading />}>
        <SearchResultsList searchResultPromise={searchResultsPromise} />
      </Suspense>
    </section>
  );
}

function SearchResultsLoading() {
  return (
    <div className="mt-8 animate-pulse">
      <section className="py-4">
        <div className="mb-2 h-7 w-64 rounded bg-stone-300" />
        <div className="h-5 w-48 rounded bg-stone-300" />
      </section>

      <ul className="space-y-1">
        {Array.from({ length: 6 }).map((_, i) => (
          <li key={i} className="rounded-lg p-2">
            <div className="h-[52px] rounded bg-stone-300 pt-1"></div>
          </li>
        ))}
      </ul>
    </div>
  );
}
