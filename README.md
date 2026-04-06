# BallkanBizz Marketplace

This project contains a marketplace backend and frontend scaffold for store registration with a free first-year period and manual payment confirmation after 12 months.

## Backend

1. Open a terminal in `backend`
2. Run `npm install`
3. Copy `.env.example` to `.env` and update `JWT_SECRET` if desired
4. Start the server with `npm run dev`

Default backend port: `http://localhost:4000`

Admin user created automatically:
- email: `admin@ballkanbizz.local`
- password: `Admin123!`

## Frontend

1. Open a terminal in `frontend`
2. Run `npm install`
3. Start the app with `npm run dev`

Default frontend port: `http://localhost:5173`

## Usage

- Register a new store at `/register`
- Login as a store owner at `/login`
- Visit `/dashboard` to see the store status and free period information
- Use the admin credentials to log in and confirm manual payments through the backend admin endpoints
- Access the admin dashboard at `/admin` after login

## Deployment for public access

To make the marketplace global, you need to deploy the app to the internet instead of running it locally.

1. Push this project to GitHub.
2. Deploy the backend to a cloud host like Render, Railway, Fly.io, or Heroku.
3. Deploy the frontend to Vercel, Netlify, or another static host.
4. In frontend production settings, set `VITE_API_URL` to the backend’s public URL.

Example production API env:
- `VITE_API_URL=https://your-backend-host.com`

For local development, keep `VITE_API_URL` blank and Vite will proxy `/api` to `http://localhost:4000`.
# BallkanBizz
# BallkanBizz
