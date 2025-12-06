import React from "react";

export default function TripDetailLoading() {
  return (
    <div className="animate-pulse">
      {/* Trip Details Title */}
      <h1 className="mb-4 w-full text-left text-2xl font-medium">
        Trip Details
      </h1>

      {/* Trip Info Section */}
      <section className="mx-auto mb-6 w-lg rounded-lg border border-gray-200 bg-gray-50 p-4">
        <div className="mb-2 flex items-center justify-between">
          <div className="h-7 w-32 rounded bg-stone-300" />
          <div className="h-7 w-36 rounded bg-stone-300" />
        </div>
        <div>
          <div className="mb-1 h-6 w-28 rounded bg-stone-300" />
          <div className="h-5 w-80 rounded bg-stone-300" />
        </div>
      </section>

      {/* Seat Selection Title */}
      <h3 className="mb-4 text-xl font-medium">Seat Selection</h3>

      {/* Seat Grid */}
      <section className="mb-25">
        <div className="flex justify-center">
          <div className="w-lg">
            <div className="grid grid-cols-[auto_auto_1.5rem_auto_auto] items-center gap-x-4 gap-y-2 pl-10 font-mono">
              {Array.from({ length: 12 }).map((_, rowIndex) => (
                <React.Fragment key={rowIndex}>
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded bg-stone-300" />
                    <div className="h-4 w-6 rounded bg-stone-300" />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded bg-stone-300" />
                    <div className="h-4 w-6 rounded bg-stone-300" />
                  </div>
                  <div></div>
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded bg-stone-300" />
                    <div className="h-4 w-6 rounded bg-stone-300" />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded bg-stone-300" />
                    <div className="h-4 w-6 rounded bg-stone-300" />
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* User Info Title */}
        <h3 className="mt-6 w-full text-left text-xl font-medium">User Info</h3>

        {/* User Info Form */}
        <div className="mt-3 mr-auto ml-auto flex w-lg flex-col gap-3">
          <div className="w-full">
            <div className="mb-1 h-5 w-12 rounded bg-stone-300" />
            <div className="h-10 w-full rounded-md bg-stone-300" />
          </div>

          <div className="w-full">
            <div className="mb-1 h-5 w-12 rounded bg-stone-300" />
            <div className="h-10 w-full rounded-md bg-stone-300" />
          </div>

          <div className="w-full">
            <div className="mb-1 h-5 w-24 rounded bg-stone-300" />
            <div className="h-10 w-full rounded-md bg-stone-300" />
          </div>

          <div className="mt-3 h-10 w-full rounded-md bg-stone-300" />
        </div>
      </section>
    </div>
  );
}
