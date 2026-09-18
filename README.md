# QuickShow

QuickShow is a full-stack movie ticket booking application. Visitors can browse current movies, view details and scheduled screenings, select seats, and sign in with Clerk. Administrators can schedule screenings from TMDB's now-playing catalogue.

## Stack

- React 19, Vite, Tailwind CSS
- Express, MongoDB/Mongoose
- Clerk authentication and Inngest user sync
- TMDB movie data

## Run locally

1. Copy `client/.env.example` to `client/.env` and `server/.env.example` to `server/.env`.
2. Fill in the required Clerk, MongoDB, and TMDB values. Never commit either `.env` file.
3. Run `npm install` in both `client` and `server`.
4. From the repository root, run `npm run dev:server` and `npm run dev:client` in separate terminals.

The client runs at `http://localhost:5173`; the API runs at `http://localhost:3000`.

## Scripts

```bash
npm run lint
npm run build
```

## Deployment

Deploy `client` and `server` as separate Vercel projects. Configure the server's `CLIENT_URL` with the deployed client origin and configure the client’s `VITE_API_URL` with the deployed API origin. Add all environment variables in Vercel rather than committing them.

## Admin access

Set the Clerk user's `publicMetadata.role` to `admin` and ensure this claim is included in the Clerk session token template. The client and API both enforce this role for admin pages and show management.

## Current scope

The project includes server-side booking creation with atomic seat reservation. “Mark Paid” is a development-only status action; integrate a payment provider webhook before treating it as a real payment flow.
