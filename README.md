# Ticket Booking App (Manual Setup)

> Docker was having trouble installing on my old personal Mac, so these steps must be done manually.

## Prerequisites

- Postgres installed and running
- Node.js version 18
- npm

## Frontend

```bash
cd frontend/ticket-booking
npm install
npm run start
```

Frontend runs on port 3000.

## Backend

Create a new db called ticket_booking. The below assumes you are using the postgres superuser to do so.
```bash
psql -U postgres -c "CREATE DATABASE ticket_booking"
```

Update `backend/env` and set `DATABASE_URL` to match your local Postgres credentials, e.g.:

```
postgresql://<db_user>:<password>@127.0.0.1:5432/ticket_booking?connection_limit=10
```

```bash
cd backend
npm install
npm run prisma:migrate
npm run prisma:generate
npm run seed
npm run start
```

Backend runs on port 5000.


# Scale Questions
- **Availability target:** *four nines* (99.99%) **design intent** — you won’t implement HA multi‑region, just discuss how your design would achieve it in the Readme.

My design would achieve HA multi-region by having:
1) A full backend stack deployed in each region -> this would include Node.js servers, redis cache, local load balancer, etc.
2) Global load balancer to route to nearest healthy regional cluster
3) Database Replication - Each primary database has standby replicas deployed in other regions. Replicas continuously replicate data from the primary and can be promoted in case of failure.
5) Monitoring such as health checks to quickly detect unhealthy nodes and remove them from the pool of servers serving traffic


- **Scale assumptions:** ~1,000,000 DAU; peak ~50000 concurrent users. Just discuss how your design would achieve it in the Readme.

1) Use a **distributed cache** to handle most read traffic - this can be done since the total data size is relativiely small (ie million events per year and storing the tier count or seats avaiable is not that large)
    - Store event, venue, user ticket mapping (mapping userId to array of ticketIds)
    - Store the counts of each ticket tier for an event in cache.
    - This can be done by using a change data capture.:
        - Use **CDC (Change Data Capture)**: push ticket updates (sold/available) to a queue
        - Workers update Redis asynchronously
        - Run **reconciliation job** periodically: Compare Postgres counts to Redis and correct discrepancies
        - Optionally have his caching strategy only for **high-volume events**
        - **Potential Con** There will potentially be some latency in updates on these reads- reads will be a bit stale. From a user persepctive standpoint it could be a potential issue, but I think the tradeoff for read speed and scaling is worth it.
2) DB read replicas - Having read replicas of the primary db - this will allow the system to scale and serve reads faster. 
3) Managing high concurrency/large number of writes:
    - For extremely popular events, use **Queue-it (Virtual Waiting Room)**
        - Controls user entry rate
        - Prevents backend overload
    - 2. **Sharding the write database by event id** - This will allow us to have multiple write databases allowing us to scale our writes.
        - One con of this is could be if users want to get the tickets for all the events they are going too/past tickets - then would need to query multiple shards. This can be slightly mitigated by just keeping another table which has maps the userid and ticketid and then queries the shards that have the event associated with that ticket. Also storing this data in LRU based distrbited cache and keeping it updated can be a strategy. This would likely be able to serve most users - 100,000,000 million users * 10 tickets on average per user * 150b per ticket = 150gb redis cluster. 
    - 3. **`SELECT ... FOR UPDATE SKIP LOCKED`**- Instead of saving a row for each ticket count for each event represent a row for each ticket. Also, since write contention can be an issue if many users are trying to buy the same tickets for the same event, we should use skip locked. In this way latency will be reduced on bookings, as there will not be multiple operations waiting for the same lock to be released.


- **Performance:** Booking request p95 < 500ms. Just discuss how your design would achieve it in the Readme.

1) Use cache for most reads as referred to in point 1) above - this will allow less read load on dbs allowing for more write throughput and speed. 
2) Performing reads only on read replica dbs - less read load on primary dbs allowing for more write throughput and speed.
3) Much of the same point I spoke about in 3) above- largely using **`SELECT ... FOR UPDATE SKIP LOCKED`**- and **Sharding the write database by event id**
4) Using redis locks and atomic counters to better track available tickets per tier - if there are less than the count that user wants can return back "No tickets available" immeditately. 
   - **Con** - Could potentially get out of sync with DB.


### Consistency & Concurrency (Critical)

1) I ran 3 **for update skip locked** queries one for each tier and then determined if the count of each tier was equal to its needed count. If it was not I released the lock, otherwise I updated all the ids associated with those tickets to sold. I chose to use a skip locked because if not it could lead to high write contention at scale and without the skip locked a deadlock could occur. 

Example deadlock:
User A -> has lock on 1 ticket for tier 1 but is waiting for lock to be released for ticket for tier2
User B -> has lock on 1 ticket for tier 2 but is waiting for lock to be released for 1 ticket for tier 1


The issues with my design is that I am running 3 seperate Select queries which is not optimal because thats 3 roundtrips. Also with the logic it is possible for a row a ticket to not be bought.

User A -> User A wants tickets for 1 ticket each tier -> has lock on 1 ticket tier 1, 1 ticket tier 2, and 0 for tier3
User B -> User B wants tickets for 1 ticket in total for tier 1 -> Since User A has lock on tier 1 ticket skips and returns to user saying no tickets avaible to user.

User A then does not update the 1 ticket for tier 1 to sold because they do not have a ticket for tier3. 


Solution:
Redis atomic counters / distributed locks:

-Use Redis to track available tickets per tier.
-Allocate tickets in a single atomic operation across all tiers before updating DB.
-Reduces roundtrips and avoids partial allocation issues.- 
- **Con** - Could potentially get out of sync with DB.

