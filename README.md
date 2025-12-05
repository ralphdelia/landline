This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Local Dev

To get started with local development:

1. Install dependencies:
```bash
pnpm install
```

2. Start the PostgreSQL database:
```bash
pnpm db:up
```

3. Run the development server:
```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

When you're done developing, you can stop the database with:
```bash
pnpm db:down
```


## locations
**Fields**
- id
- name
- abbreviation
- city
- country
#### Relationships
- **1:M with routes (as origin)**  
    One location can be the origin for many routes.
- **1:M with routes (as destination)**  
    One location can be the destination for many routes.

## routes
**Fields**
- id
- origin_location_id
- destination_location_id

#### Relationships
- **M:1 with locations (origin)**  
    Each route has one origin location.
- **M:1 with locations (destination)**  
    Each route has one destination location.
- **1:M with trips**  
    One route can have many scheduled trips.

## trips
**Fields**
- id
- route_id
- cost
- date
- departure_time
- arrival_time
#### Relationships
- **M:1 with routes**  
    Each trip belongs to one route.
- **1:M with seats**  
    One trip contains many seats.

## seats
**Fields**  
- id  
- trip_id  
- seat_number  
#### Relationships  
- **M:1 with trips**  
    Each seat belongs to one trip.  
- **M:M with bookings via booking_seats**  
    Each seat can be linked to multiple bookings over different trips, but for a given trip, a seat can only be reserved once.

## bookings
**Fields**  
- id  
- confirmation_number  
- user_id  
- status (reserved, booked, canceled)  
- reserved_until  
- amount  
- created_at  
#### Relationships  
- **M:1 with users**  
    A booking is made by one user.  
- **M:M with seats via booking_seats**  
    A booking can hold one or multiple seats through the join table.

## booking_seats
**Fields**  
- id  
- booking_id  
- seat_id  
- created_at  
#### Relationships  
- **M:1 with bookings**  
    Each row links one seat to one booking.  
- **M:1 with seats**  
    Each row references a single seat.  
- **Unique constraint**  
    Ensures a seat is only booked once per trip while allowing multiple seats per booking.

## users
**Fields**  
- id  
- name  
- email  
- date of birth  
- phone  
- address  
- billing_address  
- payment_method_type (credit, debit, etc.)  
- payment_method_last4  
- created_at  
#### Relationships  
- **1:M with bookings**  
    A user can have many bookings.


```mermaid
erDiagram

    LOCATIONS {
        int id
        string name
        string abbreviation
        string city
        string country
    }

    ROUTES {
        int id
        int origin_location_id
        int destination_location_id
    }

    TRIPS {
        int id
        int route_id
        date date
        time departure_time
        time arrival_time
    }

    SEATS {
        int id
        int trip_id
        string seat_number
    }

    BOOKINGS {
        int id
        string confirmation_number
        int user_id
        string status
        datetime reserved_until
        decimal amount
        datetime created_at
    }

    BOOKING_SEATS {
        int id
        int booking_id
        int seat_id
        datetime created_at
    }

    USERS {
        int id
        string name
        string email
        date date_of_birth
        string phone
        string address
        string billing_address
        string payment_method_type
        string payment_method_last4
        datetime created_at
    }

    %% relationships

    LOCATIONS ||--o{ ROUTES : "origin"
    LOCATIONS ||--o{ ROUTES : "destination"

    ROUTES ||--o{ TRIPS : "has trips"

    TRIPS ||--o{ SEATS : "has seats"

    BOOKINGS ||--o{ BOOKING_SEATS : "contains"
    SEATS ||--o{ BOOKING_SEATS : "reserved via"

    USERS ||--o{ BOOKINGS : "makes"

```
#### Application Routes
`/` – Root search page
- User selects origin, destination, date
- Requires all fields before showing results  
    **Query params:** `from`, `to`, `date`
 
 `/trip/[tripId]` – Trip detail
- Shows seat layout and availability
- User selects seat count and sees cost
- Enter name, email, date of birth
- Checkout creates a user and a reserved booking

`/trip/[tripId]/payment` – Payment page
- Handles payment for the reserved booking

`/trip/[tripId]/checkout` – Review page
- Shown after successful payment
- Displays confirmation info
 
 `*` – Not found
- Fallback for unmatched routes

#### API Routes
 `/cron/seat` – Clear expired reservations
- Removes bookings in reserved status older than one hour
- Resets them to open


## SEED DATA
seats
```json
[
  "A1", "A2", "A3", "A4",
  "B1", "B2", "B3", "B4",
  "C1", "C2", "C3", "C4",
  "D1", "D2", "D3", "D4",
  "E1", "E2", "E3", "E4",
  "F1", "F2", "F3", "F4",
  "G1", "G2", "G3", "G4",
  "H1", "H2", "H3", "H4",
  "I1", "I2", "I3", "I4",
  "J1", "J2", "J3", "J4",
  "K1", "K2", "K3", "K4",
  "L1", "L2", "L3", "L4"
]

taken:
["C2", "F4", "A1", "H3", "D1", "K2", "B4"]

```

graph connections
```json
{
  "EWR": ["LGA","JFK","BUF","BOS","PHL","BWI","DCA","IAD","RDU","CHS"],
  "LGA": ["EWR","JFK","BUF","BOS","PHL","BWI","DCA","IAD","RDU","JAX"],
  "JFK": ["EWR","LGA","BUF","BOS","PHL","BWI","DCA","IAD","CHS","MIA"],
  "BUF": ["EWR","LGA","JFK","BOS","PHL","BWI","DCA","IAD","JAX","MIA"],
  "BOS": ["EWR","LGA","JFK","BUF","PHL","BWI","DCA","IAD","CLT","RDU"],
  "PHL": ["EWR","LGA","JFK","BUF","BOS","BWI","DCA","IAD","CLT","CHS"],
  "BWI": ["EWR","LGA","JFK","BUF","BOS","PHL","DCA","IAD","CLT","JAX"],
  "DCA": ["EWR","LGA","JFK","BUF","BOS","PHL","BWI","IAD","RDU","MIA"],
  "IAD": ["EWR","LGA","JFK","BUF","BOS","PHL","BWI","DCA","CHS","JAX"],
  "CLT": ["RDU","CHS","JAX","MIA","BOS","PHL","BWI"],
  "RDU": ["CLT","CHS","JAX","MIA","EWR","LGA","BOS","DCA"],
  "CHS": ["CLT","RDU","JAX","MIA","EWR","JFK","PHL","IAD"],
  "JAX": ["CLT","RDU","CHS","MIA","LGA","BUF","BWI","IAD"],
  "MIA": ["CLT","RDU","CHS","JAX","JFK","BUF","DCA"]
}
```

locations
```json
[
  { "name": "Newark Liberty International Airport", "abbreviation": "EWR" },
  { "name": "LaGuardia Airport", "abbreviation": "LGA" },
  { "name": "John F. Kennedy International Airport", "abbreviation": "JFK" },
  { "name": "Buffalo Niagara International Airport", "abbreviation": "BUF" },
  { "name": "Boston Logan International Airport", "abbreviation": "BOS" },
  { "name": "Philadelphia International Airport", "abbreviation": "PHL" },
  { "name": "Baltimore Washington International Airport", "abbreviation": "BWI" },
  { "name": "Ronald Reagan Washington National Airport", "abbreviation": "DCA" },
  { "name": "Washington Dulles International Airport", "abbreviation": "IAD" },
  { "name": "Charlotte Douglas International Airport", "abbreviation": "CLT" },
  { "name": "Raleigh Durham International Airport", "abbreviation": "RDU" },
  { "name": "Charleston International Airport", "abbreviation": "CHS" },
  { "name": "Jacksonville International Airport", "abbreviation": "JAX" },
  { "name": "Miami International Airport", "abbreviation": "MIA" }
]
```


Schedule
```json
[
  {"departure":"2025-12-04T06:00","arrival":"2025-12-04T07:30"},
  {"departure":"2025-12-04T08:00","arrival":"2025-12-04T09:30"},
  {"departure":"2025-12-04T10:00","arrival":"2025-12-04T11:30"},
  {"departure":"2025-12-04T12:00","arrival":"2025-12-04T13:30"},
  {"departure":"2025-12-04T14:00","arrival":"2025-12-04T15:30"},
  {"departure":"2025-12-04T16:00","arrival":"2025-12-04T17:30"}
]
```
