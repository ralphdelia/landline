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

  const trip = await getTripById(tripId);

  if (!trip) {
    notFound();
  }

  return <TripDetailClient trip={trip} />;
}
