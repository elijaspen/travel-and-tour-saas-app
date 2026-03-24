### Part 1: The Agency Tour Creation Flow (Data Input)

When an agency logs into your SaaS dashboard to create a new tour, here is exactly what happens in the database:

**Step 1: Core Details & Fleet Capacity (`TOURS` Table)**
* The agency fills out the basic info: Title, Description, and uses the Google Maps autocomplete to automatically fill the clean location fields like `city`, `latitude`, `longitude`, etc. *(No more `location_` prefix!)*
* They set `duration_days` = 3 (for the 3D2N package).
* They set `default_capacity` = 15 (meaning a single booking/group can’t exceed 15 people because that's the max boat size).
* They set `max_simultaneous_bookings` = 2 (because the agency owns 2 boats, meaning they can run two completely separate private groups on the same day).
* They select `tour_type` = `'on_demand'` (private tour).
* *Action:* 1 row is inserted into the `TOURS` table.

**Step 2: The Daily Schedule (`TOUR_ITINERARIES` Table)**
* The agency builds out their day-by-day schedule. 
* *Action:* Your backend inserts multiple rows linked to this `tour_id`:
    * Row 1: `day_number`: 1, `title`: "Arrival & Briefing", `image_url`: "url-to-port.jpg"
    * Row 2: `day_number`: 2, `title`: "Gigantes Island Hopping", `image_url`: "url-to-tangke.jpg"

**Step 3: Tiered Volume Pricing (`TOUR_PRICES` Table)**
* The agency sets up their "Per Head" volume discounts. 
* *Action:* Your backend multiplies their inputted prices by 100 to avoid floating-point errors, then inserts multiple rows into `TOUR_PRICES` linked to this `tour_id`:
    * Row 1: `min_pax`: 1, `max_pax`: 1, `amount`: 499900 *(Represents ₱4,999.00)*
    * Row 2: `min_pax`: 2, `max_pax`: 3, `amount`: 369900 *(Represents ₱3,699.00)*
    * Row 3: `min_pax`: 4, `max_pax`: 5, `amount`: 359900 *(Represents ₱3,599.00)*

**Step 4: Availability & Media (`BLACKOUT_DATES` & `TOUR_PHOTOS`)**
* Because this is an `'on_demand'` tour, the calendar is automatically wide open. The agency only needs to explicitly block out dates if, for example, a boat is down for maintenance next week.
* *Action:* If they select days off, rows are inserted into `BLACKOUT_DATES`. Photos are uploaded and inserted into `TOUR_PHOTOS`. The tour is published (`is_active` = true).

---



### Part 2: The Traveler Booking Flow (Data Output & Transaction)

Now, a traveler visits your platform to book that exact tour.

**Step 1: Tour Discovery**
* The traveler clicks the 3D2N Gigantes Island tour.
* *Read Operation:* Your frontend queries the `TOURS` table to load the description, queries `TOUR_ITINERARIES` to render the beautiful vertical timeline with images, and queries `TOUR_PRICES` to display a badge saying: *"From ₱2,899 / head"*.

**Step 2: Date Selection (The Calendar Logic)**
* The traveler opens the date picker. 
* *Read Operation:* Your backend runs a query checking `BLACKOUT_DATES` and existing `BOOKINGS` for this `tour_id`. 
* It counts how many overlapping confirmed bookings exist on any given day. If a day has 2 overlapping bookings (which hits the `max_simultaneous_bookings` limit of the agency's 2 boats), that specific date is grayed out on the frontend.
* The traveler clicks an available start date: **May 10th**. 
* Your frontend automatically sets the end date to **May 12th** (based on `duration_days` = 3).

**Step 3: Pax Selection & Dynamic Pricing**
* The traveler clicks the "+" button to say they are bringing **3 Guests**.
* *Logic Check:* Your frontend checks that 3 does not exceed the `TOURS.default_capacity` of 15.
* *Price Math:* Your frontend looks at the `TOUR_PRICES` data it loaded earlier. It sees that 3 guests falls into the tier where `min_pax` = 2 and `max_pax` = 3. 
* It grabs the integer `amount` (`369900`) and calculates the total in cents: `3 * 369900 = 1109700`. *(Your frontend UI divides this by 100 to beautifully display ₱11,097.00 to the user).*

**Step 4: The Checkout Transaction (`BOOKINGS` Table)**
* The traveler enters their details and clicks "Proceed to Payment."
* *Write Operation:* Your backend starts a strict database transaction to prevent double-booking. It locks the tour row, counts the overlaps one last time just to be safe, and then inserts a new row into the `BOOKINGS` table using the exact integer values:
    * `start_date`: '2026-05-10'
    * `end_date`: '2026-05-12'
    * `participant_count`: 3
    * `unit_price`: 369900 *(Locked in as an integer)*
    * `total_price`: 1109700 *(Locked in as an integer)*
    * `status`: 'pending_payment'

**Step 5: Payment (`PAYMENTS` Table)**
* The backend sends the `total_price` (`1109700`) directly to the PayMongo API. Because PayMongo expects the value in cents, you don't have to write any messy conversion code here!
* Once PayMongo successfully charges the card, it sends a webhook back to your server.
* *Write Operation:* Your backend inserts a row into the `PAYMENTS` table and updates the `BOOKINGS.status` from `'pending_payment'` to `'confirmed'`. 
* The tour is officially locked in, the agency is notified, and that boat is removed from the available inventory for May 10-12!