"use client";

import { useActionState } from "react";
import { processPayment } from "@/actions";
import { Button } from "@/components/ui";

interface PaymentFormProps {
  bookingId: number;
  tripId: number;
  amount: string;
}

export function PaymentForm({ bookingId, tripId, amount }: PaymentFormProps) {
  const [state, formAction, isPending] = useActionState(processPayment, {
    errors: [],
  });

  const hasGeneralError = state.errors && state.errors.length > 0;
  const fieldErrors = state.properties || {};

  return (
    <section className="w-full">
      <h2 className="mb-4 text-lg font-semibold">Payment Information</h2>

      {hasGeneralError && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3">
          <p className="text-sm text-red-800">{state.errors[0]}</p>
        </div>
      )}

      <form action={formAction} className="space-y-4">
        <input type="hidden" name="bookingId" value={bookingId} />
        <input type="hidden" name="tripId" value={tripId} />

        <div>
          <label
            htmlFor="cardholderName"
            className="mb-1 block text-sm font-medium"
          >
            Cardholder Name
          </label>
          <input
            id="cardholderName"
            name="cardholderName"
            type="text"
            required
            disabled={isPending}
            className="w-full rounded-md border border-stone-300 bg-stone-50 px-3 py-2 disabled:opacity-50"
          />
          {fieldErrors?.cardholderName && (
            <p className="mt-1 text-sm text-red-600">
              {fieldErrors.cardholderName.errors[0]}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="cardNumber"
            className="mb-1 block text-sm font-medium"
          >
            Card Number
          </label>
          <input
            id="cardNumber"
            name="cardNumber"
            type="text"
            required
            placeholder="1234 5678 9012 3456"
            maxLength={19}
            disabled={isPending}
            className="w-full rounded-md border border-stone-300 bg-stone-50 px-3 py-2 disabled:opacity-50"
          />
          {fieldErrors?.cardNumber && (
            <p className="mt-1 text-sm text-red-600">
              {fieldErrors.cardNumber.errors[0]}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="expiryDate"
              className="mb-1 block text-sm font-medium"
            >
              Expiry Date
            </label>
            <input
              id="expiryDate"
              name="expiryDate"
              type="text"
              required
              placeholder="MM/YY"
              maxLength={5}
              disabled={isPending}
              className="w-full rounded-md border border-stone-300 bg-stone-50 px-3 py-2 disabled:opacity-50"
            />
            {fieldErrors?.expiryDate && (
              <p className="mt-1 text-sm text-red-600">
                {fieldErrors.expiryDate.errors[0]}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="cvv" className="mb-1 block text-sm font-medium">
              CVV
            </label>
            <input
              id="cvv"
              name="cvv"
              type="text"
              required
              placeholder="123"
              maxLength={4}
              disabled={isPending}
              className="w-full rounded-md border border-stone-300 bg-stone-50 px-3 py-2 disabled:opacity-50"
            />
            {fieldErrors?.cvv && (
              <p className="mt-1 text-sm text-red-600">
                {fieldErrors.cvv.errors[0]}
              </p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="billingAddress"
            className="mb-1 block text-sm font-medium"
          >
            Billing Address
          </label>
          <input
            id="billingAddress"
            name="billingAddress"
            type="text"
            required
            disabled={isPending}
            className="w-full rounded-md border border-stone-300 bg-stone-50 px-3 py-2 disabled:opacity-50"
          />
          {fieldErrors?.billingAddress && (
            <p className="mt-1 text-sm text-red-600">
              {fieldErrors.billingAddress.errors[0]}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="paymentMethodType"
            className="mb-1 block text-sm font-medium"
          >
            Card Type
          </label>
          <select
            id="paymentMethodType"
            name="paymentMethodType"
            required
            disabled={isPending}
            className="w-full rounded-md border border-stone-300 bg-stone-50 px-3 py-2 disabled:opacity-50"
          >
            <option value="">Select card type</option>
            <option value="credit">Credit</option>
            <option value="debit">Debit</option>
          </select>
          {fieldErrors?.paymentMethodType && (
            <p className="mt-1 text-sm text-red-600">
              {fieldErrors.paymentMethodType.errors[0]}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isPending}
          className="w-full"
          // className="mt-4 w-full rounded-md bg-stone-800 px-4 py-3 font-medium text-white hover:bg-stone-700 disabled:opacity-50"
        >
          {isPending ? "Processing..." : `Complete Payment ($${amount})`}
        </Button>
      </form>
    </section>
  );
}
