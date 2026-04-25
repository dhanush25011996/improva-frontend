# Improva Frontend

React + TypeScript frontend for the bus seat reservation assignment.

## Tech Stack

- React 19
- TypeScript
- Vite
- React Router
- Tailwind CSS

## Prerequisites

- Node.js 18+ (recommended Node 20+)
- npm

## Environment

Create `.env` in `improva-frontend`:

```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

`VITE_API_BASE_URL` is used only when backend integration is enabled.

## Backend Integration Toggle

This project supports two data modes:

- `localStorage` mode (default, PDF-friendly browser-only behavior)
- backend API mode

Control it in `src/features/booking/constants.ts`:

```ts
export const IS_BACKEND_INTEGRATED = false;
```

- `false` -> all reservation data is stored in browser localStorage
- `true` -> all reservation operations call backend APIs

## Install and Run

From `improva-frontend`:

```bash
npm install
npm run dev
```

Vite is configured for port `3001`, but may move to next free port if occupied.

## Build

```bash
npm run build
npm run preview
```

## Features Implemented

- Seat reservation view (landscape seat layout)
- Dashboard view
- Add reservation
- Edit passenger details
- Delete reservation (cancel seat)
- Browser storage mode and backend mode

## API Endpoints Used (backend mode)

When `IS_BACKEND_INTEGRATED = true`, frontend uses:

- `GET /api/v1/booking/closed`
- `POST /api/v1/booking/:seatNumber/book`
- `PATCH /api/v1/booking/:seatNumber/passenger`
- `POST /api/v1/booking/:seatNumber/cancel`
- `POST /api/v1/booking/admin/reset`
