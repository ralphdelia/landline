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
  initialValues?: {
    from?: string;
    to?: string;
    date?: string;
  };
};

export function TripSearchForm({ origins, initialValues }: Props) {
  const router = useRouter();
  const [from, setFrom] = useState(initialValues?.from || "");
  const [to, setTo] = useState(initialValues?.to || "");
  const [date, setDate] = useState(initialValues?.date || "");
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

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex w-full flex-wrap gap-3">
        <div className="min-w-0 flex-2">
          <label htmlFor="from" className="mb-1 block text-sm font-medium">
            From
          </label>
          <div className="relative">
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
              style={from ? { color: "transparent" } : {}}
            >
              <option value="">Select origin</option>
              {origins.map((origin) => (
                <option key={origin.id} value={origin.abbreviation}>
                  {origin.name} ({origin.abbreviation})
                </option>
              ))}
            </select>
            {from && (
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-3">
                <span className="text-gray-900">{from}</span>
              </div>
            )}
          </div>
          <div className="mt-0.5 h-4">
            {errors.from && (
              <p className="text-xs text-red-500">{errors.from}</p>
            )}
          </div>
        </div>
        <div className="min-w-0 flex-2">
          <label htmlFor="to" className="mb-1 block text-sm font-medium">
            To
          </label>
          <div className="relative">
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
              style={to ? { color: "transparent" } : {}}
            >
              <option value="">Select destination</option>
              {availableDestinations.map((destination) => (
                <option key={destination.id} value={destination.abbreviation}>
                  {destination.name} ({destination.abbreviation})
                </option>
              ))}
            </select>
            {to && (
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-3">
                <span className="text-gray-900">{to}</span>
              </div>
            )}
          </div>
          <div className="mt-0.5 h-4">
            {errors.to && <p className="text-xs text-red-500">{errors.to}</p>}
          </div>
        </div>

        <div className="min-w-0 flex-2">
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
      </div>
      <div className="flex-1 align-bottom">
        <Button className="mt-2 w-full font-medium" type="submit">
          Search Trips
        </Button>
      </div>
    </form>
  );
}
