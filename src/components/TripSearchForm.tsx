"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  tripSearchSchema,
  type OriginWithDestinations,
  type TripSearchFormData,
} from "@/types";
import { Button } from "@/components/ui";

type Props = {
  origins: OriginWithDestinations[];
};

export function TripSearchForm({ origins }: Props) {
  const router = useRouter();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [errors, setErrors] = useState<
    Partial<Record<keyof TripSearchFormData, string>>
  >({});

  const selectedOrigin = origins.find((origin) => origin.abbreviation === from);
  const availableDestinations = selectedOrigin?.destinations || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = tripSearchSchema.safeParse({ from, to, date });

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof TripSearchFormData, string>> = {};
      result.error.issues.forEach((err) => {
        const field = err.path[0] as keyof TripSearchFormData;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});

    const params = new URLSearchParams({
      from: result.data.from,
      to: result.data.to,
      date: result.data.date,
    });

    router.push(`/?${params.toString()}`);
  };

  const handleClear = () => {
    setFrom("");
    setTo("");
    setDate("");
    setErrors({});
    router.push("/");
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex w-full flex-wrap gap-3">
        <div className="min-w-0 flex-1">
          <label htmlFor="from" className="mb-1 block text-sm font-medium">
            From
          </label>
          <select
            id="from"
            value={from}
            onChange={(e) => {
              setFrom(e.target.value);
              setTo(""); // Reset destination when origin changes
              setErrors((prev) => ({ ...prev, from: undefined }));
            }}
            className={`w-full rounded-md border px-3 py-2 ${
              errors.from ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Select origin</option>
            {origins.map((origin) => (
              <option key={origin.id} value={origin.abbreviation}>
                {origin.name} ({origin.abbreviation})
              </option>
            ))}
          </select>
          <div className="mt-0.5 h-4">
            {errors.from && (
              <p className="text-xs text-red-500">{errors.from}</p>
            )}
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <label htmlFor="to" className="mb-1 block text-sm font-medium">
            To
          </label>
          <select
            id="to"
            value={to}
            onChange={(e) => {
              setTo(e.target.value);
              setErrors((prev) => ({ ...prev, to: undefined }));
            }}
            disabled={!from}
            className={`w-full rounded-md border px-3 py-2 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:opacity-50 ${
              errors.to ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Select destination</option>
            {availableDestinations.map((destination) => (
              <option key={destination.id} value={destination.abbreviation}>
                {destination.name} ({destination.abbreviation})
              </option>
            ))}
          </select>
          <div className="mt-0.5 h-4">
            {errors.to && <p className="text-xs text-red-500">{errors.to}</p>}
          </div>
        </div>
      </div>
      <div className="mt-3 flex w-full flex-wrap items-start gap-3">
        <div className="min-w-0 flex-1">
          <label htmlFor="date" className="mb-1 block text-sm font-medium">
            Date
          </label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              setErrors((prev) => ({ ...prev, date: undefined }));
            }}
            className={`w-full rounded-md border px-3 py-2 ${
              errors.date ? "border-red-500" : "border-gray-300"
            }`}
          />
          <div className="mt-0.5 h-4">
            {errors.date && (
              <p className="text-xs text-red-500">{errors.date}</p>
            )}
          </div>
        </div>

        <div className="flex shrink-0 gap-2 pt-6">
          <Button type="submit">Search Trips</Button>
          <Button type="button" onClick={handleClear}>
            Clear
          </Button>
        </div>
      </div>
    </form>
  );
}
