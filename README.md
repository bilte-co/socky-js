# socky

JavaScript SDK for the public routes of the Socky Flights API.

## Install

```sh
pnpm add @bilte-co/socky-js
# or: npm i @bilte-co/socky-js
```

## Quickstart (ESM)

```js
import { Socky } from 'socky';

// Do not expose your API key to the client.
const client = new Socky({ apiKey: process.env.SOCKY_API_KEY });

// Get flight data
const flight = await client.flights.get('01JCTA5XQZF8B3G5N2W9K7M4VP');

// Get aircraft information
const aircraft = await client.aircraft.get('N12345');

// List stations with pagination
const stations = await client.stations.list();
console.log(stations.items);
console.log(stations.hasMore);
```

## Quickstart (CJS)

```js
const { Socky } = require('socky');

// Do not expose your API key to the client.
const client = new Socky({ apiKey: process.env.SOCKY_API_KEY });

// Use the client as shown above
```

## Configuration

The SDK accepts the following configuration options:

```js
const client = new Socky({
  apiKey: 'your-api-key',        // Required
  baseUrl: 'https://api.custom.com/',  // Optional, defaults to 'https://api.socky.flights/'
  version: 'v1',                  // Optional, defaults to 'v1'
  timeoutMs: 30000,               // Optional, request timeout in ms (default: 30000)
  retries: 2,                     // Optional, number of retries on failure (default: 2)
  retryBackoffMs: 250,            // Optional, initial retry backoff in ms (default: 250)
  userAgent: 'my-app/1.0',       // Optional, custom user agent string
});
```

## Error Handling

The SDK throws typed `ApiError` instances with detailed information:

```js
import { Socky, ApiError } from 'socky';

try {
  const flight = await client.flights.get('invalid-id');
} catch (error) {
  if (error instanceof ApiError) {
    console.log(error.status);      // HTTP status code
    console.log(error.message);     // Error message
    console.log(error.code);        // Optional error code from API
    console.log(error.requestId);   // Optional request ID for debugging
    console.log(error.retryAfterMs); // Optional retry-after hint
    console.log(error.body);        // Raw error response body
  }
}
```

## Pagination

Paginated endpoints return a `Page<T>` object with helpers for iteration:

```js
// Manual pagination
let page = await client.stations.list();
console.log(page.items);

if (page.hasMore && page.nextCursor) {
  const nextPage = await client.stations.list(page.nextCursor);
}

// Automatic page iteration
for await (const page of client.stations.paginatePages(20, 10)) {
  console.log(`Page with ${page.items.length} stations`);
}

// Automatic item iteration
for await (const station of client.stations.paginateItems(20, 10)) {
  console.log(station.code);
}
```

## Retries and Timeouts

The SDK automatically retries failed requests for transient errors:
- Retries on: 429 (rate limit), 503, 504, and 5xx errors
- Respects `Retry-After` headers
- Uses exponential backoff with jitter
- Network errors are also retried
- Only GET requests are retried by default

## API

The SDK provides access to the following Socky Flights API endpoints:

### Aircraft
- `aircraft.get(registration)` - Get aircraft by registration
- `aircraft.list(cursor?, limit?)` - List aircraft (paginated)
- `aircraft.position(registration)` - Get last known position
- `aircraft.flights(registration, cursor?, limit?)` - Get flights for aircraft (paginated)

### Flights
- `flights.get(ulid)` - Get flight by ID
- `flights.track(ulid)` - Get flight track data

### Locations
- `locations.get(lat, lng)` - Get location information

### Positions
- `positions.latest(tails)` - Get latest positions for aircraft (accepts string or array)

### Routes
- `routes.get(from, to)` - Get route information between two stations

### Stations
- `stations.get(code)` - Get station by code
- `stations.list(cursor?, limit?)` - List all stations (paginated)
- `stations.search(query)` - Search stations by name or code
- `stations.proximity({ latitude, longitude, distance?, unit? })` - Find stations near coordinates
- `stations.near(code, { distance?, unit? })` - Find stations near another station
- `stations.paginatePages(limit?, pageLimit?)` - Iterate over pages
- `stations.paginateItems(limit?, pageLimit?)` - Iterate over individual items

## Node support

Node >= 18.

## License

Apache-2.0
