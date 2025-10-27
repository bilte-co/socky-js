# socky

JavaScript SDK for the Socky Flights API.

## Install

```sh
pnpm add socky
# or: npm i socky
```

## Quickstart (ESM)

```js
import { Socky } from 'socky';

const client = new Socky({ apiKey: process.env.SOCKY_API_KEY! });

// Get flight data
const flights = await client.flights.list();
console.log(flights);

// Get aircraft information
const aircraft = await client.aircraft.get('N12345');
console.log(aircraft);
```

## Quickstart (CJS)

```js
const { Socky } = require('socky');

const client = new Socky({ apiKey: process.env.SOCKY_API_KEY });

// Use the client as shown above
```

## API

The SDK provides access to the following Socky Flights API endpoints:

- `aircraft` - Aircraft data and information
- `flights` - Flight tracking and schedules
- `locations` - Airport and location data
- `positions` - Real-time position data
- `routes` - Route information
- `stations` - Station and airport details

## Node support

Node >= 18.

## License

Apache-2.0
