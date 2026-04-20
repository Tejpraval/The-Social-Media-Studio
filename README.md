# CreatorOS

CreatorOS is a production-ready MERN creative studio that transforms a rough idea into a structured narrative, editable social creative, brand-consistent slides, captions, hashtags, and downloadable assets.

## Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MongoDB Atlas or local MongoDB
- Auth: JWT + bcrypt
- Export: PNG per slide and ZIP carousel from the browser
- AI: secure backend adapters with deterministic local fallbacks

## Local Setup

```bash
npm install
cp server/.env.example server/.env
cp client/.env.example client/.env
npm run dev
```

Frontend: `http://localhost:5174`

Backend: `http://localhost:8081`

The app works without AI keys by using a local narrative, image, and intelligence engine. Add provider keys to `server/.env` to replace the adapters with live AI calls.

If you do not have MongoDB running locally:

```bash
docker compose up -d
```

## Demo Account

Create a new account from the Login page. A default brand profile is generated automatically.

## Deployment

### Backend: Render or Railway

Set the root directory to `server` and configure:

```bash
npm install
npm start
```

Environment variables:

- `MONGO_URI`
- `JWT_SECRET`
- `CLIENT_URL`
- optional `OPENAI_API_KEY`
- optional `IMAGE_API_KEY`

### Frontend: Vercel

Set the root directory to `client`.

Build command:

```bash
npm run build
```

Output directory:

```bash
dist
```

Environment variables:

- `VITE_API_URL=https://your-backend-url`

