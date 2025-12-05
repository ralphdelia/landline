import React, { Suspense } from "react";
import { getTripById } from "@/data";
import { notFound } from "next/navigation";
import { TripDetailClient } from "./TripDetailClient";

export default async function TripDetailPage({
  params,
}: {
  params: Promise<{ tripId: number }>;
}) {
  const { tripId } = await params;

  if (!tripId) {
    notFound();
  }

  const tripPromsise = getTripById(tripId);

  return (
    <Suspense fallback={<div>Loading trip details...</div>}>
      <TripDetailClient tripPromise={tripPromsise} />
    </Suspense>
  );
}
