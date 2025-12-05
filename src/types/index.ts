import type { locations } from "@/db/schema";
import { z } from "zod";
import type { getTripsByRoute } from "@/data";
import { createBooking, processPayment } from "@/actions";

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

export const bookingFormSchema = z.object({
  seats: z.array(z.string()).min(1, "Please select at least one seat"),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
});

export type BookingFormData = z.infer<typeof bookingFormSchema>;

export type TripWithAvailability = Awaited<
  ReturnType<typeof getTripsByRoute>
>[number];

export const paymentFormSchema = z.object({
  tripId: z.coerce.number().nullish(),
  bookingId: z.coerce.number().min(1, "Booking ID is required"),
  cardholderName: z.string().min(1, "Cardholder name is required"),
  cardNumber: z
    .string()
    .regex(/^\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/, "Invalid card number"),
  expiryDate: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Invalid expiry date (MM/YY)"),
  cvv: z.string().regex(/^\d{3,4}$/, "Invalid CVV"),
  billingAddress: z.string().min(1, "Billing address is required"),
  paymentMethodType: z.enum(["credit", "debit"], {
    message: "Please select a card type",
  }),
});

export type PaymentFormData = z.infer<typeof paymentFormSchema>;

export type BookingState = Awaited<ReturnType<typeof createBooking>>;
export type PaymentState = Awaited<ReturnType<typeof processPayment>>;
