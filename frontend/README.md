# College Management System — Frontend

React client for the College Management System. Built with **React 19**, **TypeScript**, **Vite 8**, **Tailwind CSS 4**, **React Router 7**, and **Axios**.

## Features

- Role-based dashboards for **Admin**, **Teacher**, and **Student**
- Authentication (login/register) with JWT handling and automatic logout on expiry
- Axios API layer that talks to the backend through Vite dev proxy

## Getting started

```bash
npm install
npm run dev
```

The dev server proxies API requests (`/auth`, `/courses`, `/departments`, `/students`, `/teachers`, `/enrollments`, `/stats`) to the backend at port `3005`.

## Deploying on Vercel

The `frontend/` directory is the deployment root. In Vercel:

1. Add the project with **Root Directory** set to `frontend`
2. Build command: `npm run build` (output: `dist`)
3. Set the `VITE_API_URL` environment variable to your deployed backend base URL (e.g. `https://college-management-system-f9a5.onrender.com`). When empty, the API is called same-origin (dev proxy).

`vercel.json` provides an SPA fallback so client-side routes work on refresh.

## Live demo

- Frontend: https://college-management-system-two-sable.vercel.app
- Backend API: https://college-management-system-f9a5.onrender.com

## Scripts

| Command          | Description                    |
| ---------------- | ------------------------------ |
| `npm run dev`    | Start the Vite dev server      |
| `npm run build`  | Type-check and build for prod  |
| `npm run lint`   | Run Oxlint                     |
| `npm run preview`| Preview the production build   |
