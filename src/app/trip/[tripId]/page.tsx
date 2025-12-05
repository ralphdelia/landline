import React, { Suspense } from "react";
import { getTripById } from "@/data";
import { notFound } from "next/navigation";
import { TripDetailClient } from "./TripDetailClient";

export default async function TripDetailPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;

  return (
    <Suspense fallback={<div>Loading trip details...</div>}>
      <TripDetailContent tripId={Number(tripId)} />
    </Suspense>
  );
}

async function TripDetailContent({ tripId }: { tripId: number }) {
  const trip = await getTripById(tripId);

  if (!trip) {
    notFound();
  }

  return <TripDetailClient trip={trip} />;
}
