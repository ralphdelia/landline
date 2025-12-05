import type { locations } from "@/db/schema";
import { z } from "zod";
import type { getTripsByRoute } from "@/data";

export type Location = typeof locations.$inferSelect;

export type LocationMinimal = Pick<Location, "id" | "name" | "abbreviation">;

export type OriginWithDestinations = LocationMinimal & {
  destinations: LocationMinimal[];
};

export const tripSearchSchema = z.object({
  from: z.string().min(1, "Please select an origin"),
  to: z.string().min(1, "Please select a destination"),
  date: z.string().min(1, "Please select a date"),
});

export type TripSearchFormData = z.infer<typeof tripSearchSchema>;

export type TripWithAvailability = Awaited<
  ReturnType<typeof getTripsByRoute>
>[number];
