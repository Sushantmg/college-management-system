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

The dev server proxies API requests (`/auth`, `/courses`, `/departments`, `/students`, `/teachers`, `/enrollments`) to the backend at port `4000`.

## Scripts

| Command          | Description                    |
| ---------------- | ------------------------------ |
| `npm run dev`    | Start the Vite dev server      |
| `npm run build`  | Type-check and build for prod  |
| `npm run lint`   | Run Oxlint                     |
| `npm run preview`| Preview the production build   |
