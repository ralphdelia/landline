import { db } from "@/db";
import { bookings, bookingSeats } from "@/db/schema";
import { and, lt, eq, inArray } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();

    const expiredBookings = await db
      .select({ id: bookings.id })
      .from(bookings)
      .where(
        and(eq(bookings.status, "reserved"), lt(bookings.reservedUntil, now))
      );

    if (expiredBookings.length === 0) {
      return NextResponse.json({
        message: "No expired bookings found",
        cleaned: 0,
        timestamp: now.toISOString(),
      });
    }

    const expiredBookingIds = expiredBookings.map((b) => b.id);

    await db
      .delete(bookingSeats)
      .where(inArray(bookingSeats.bookingId, expiredBookingIds));

    await db.delete(bookings).where(inArray(bookings.id, expiredBookingIds));

    return NextResponse.json({
      message: "Successfully cleaned up expired bookings",
      cleaned: expiredBookings.length,
      timestamp: now.toISOString(),
    });
  } catch (error) {
    console.error("Error cleaning up bookings:", error);
    return NextResponse.json(
      {
        error: "Failed to cleanup bookings",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
