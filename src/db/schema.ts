import { relations } from "drizzle-orm";
import {
  pgTable,
  serial,
  varchar,
  integer,
  date,
  time,
  timestamp,
  decimal,
  pgEnum,
  unique,
} from "drizzle-orm/pg-core";

// Enums
export const bookingStatusEnum = pgEnum("booking_status", [
  "reserved",
  "booked",
  "canceled",
]);

export const paymentMethodTypeEnum = pgEnum("payment_method_type", [
  "credit",
  "debit",
]);

// Tables
export const locations = pgTable("locations", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  abbreviation: varchar("abbreviation", { length: 10 }).notNull().unique(),
  city: varchar("city", { length: 255 }).notNull(),
  country: varchar("country", { length: 255 }).notNull(),
});

export const routes = pgTable("routes", {
  id: serial("id").primaryKey(),
  originLocationId: integer("origin_location_id")
    .notNull()
    .references(() => locations.id),
  destinationLocationId: integer("destination_location_id")
    .notNull()
    .references(() => locations.id),
});

export const trips = pgTable("trips", {
  id: serial("id").primaryKey(),
  routeId: integer("route_id")
    .notNull()
    .references(() => routes.id),
  cost: decimal("cost", { precision: 10, scale: 2 }).notNull(),
  date: date("date").notNull(),
  departureTime: time("departure_time").notNull(),
  arrivalTime: time("arrival_time").notNull(),
});

export const seats = pgTable("seats", {
  id: serial("id").primaryKey(),
  tripId: integer("trip_id")
    .notNull()
    .references(() => trips.id),
  seatNumber: varchar("seat_number", { length: 10 }).notNull(),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  dateOfBirth: date("date_of_birth"),
  phone: varchar("phone", { length: 20 }),
  address: varchar("address", { length: 500 }),
  billingAddress: varchar("billing_address", { length: 500 }),
  paymentMethodType: paymentMethodTypeEnum("payment_method_type"),
  paymentMethodLast4: varchar("payment_method_last4", { length: 4 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  confirmationNumber: varchar("confirmation_number", { length: 50 })
    .notNull()
    .unique(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  status: bookingStatusEnum("status").notNull().default("reserved"),
  reservedUntil: timestamp("reserved_until"),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const bookingSeats = pgTable(
  "booking_seats",
  {
    id: serial("id").primaryKey(),
    bookingId: integer("booking_id")
      .notNull()
      .references(() => bookings.id),
    seatId: integer("seat_id")
      .notNull()
      .references(() => seats.id),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    // Unique constraint to ensure a seat is only booked once per trip
    uniqueSeatBooking: unique().on(table.seatId),
  })
);

// Relations
export const locationsRelations = relations(locations, ({ many }) => ({
  routesAsOrigin: many(routes, { relationName: "origin" }),
  routesAsDestination: many(routes, { relationName: "destination" }),
}));

export const routesRelations = relations(routes, ({ one, many }) => ({
  originLocation: one(locations, {
    fields: [routes.originLocationId],
    references: [locations.id],
    relationName: "origin",
  }),
  destinationLocation: one(locations, {
    fields: [routes.destinationLocationId],
    references: [locations.id],
    relationName: "destination",
  }),
  trips: many(trips),
}));

export const tripsRelations = relations(trips, ({ one, many }) => ({
  route: one(routes, {
    fields: [trips.routeId],
    references: [routes.id],
  }),
  seats: many(seats),
}));

export const seatsRelations = relations(seats, ({ one, many }) => ({
  trip: one(trips, {
    fields: [seats.tripId],
    references: [trips.id],
  }),
  bookingSeats: many(bookingSeats),
}));

export const usersRelations = relations(users, ({ many }) => ({
  bookings: many(bookings),
}));

export const bookingsRelations = relations(bookings, ({ one, many }) => ({
  user: one(users, {
    fields: [bookings.userId],
    references: [users.id],
  }),
  bookingSeats: many(bookingSeats),
}));

export const bookingSeatsRelations = relations(bookingSeats, ({ one }) => ({
  booking: one(bookings, {
    fields: [bookingSeats.bookingId],
    references: [bookings.id],
  }),
  seat: one(seats, {
    fields: [bookingSeats.seatId],
    references: [seats.id],
  }),
}));
