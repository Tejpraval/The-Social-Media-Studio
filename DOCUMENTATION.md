# CreatorOS Project Documentation

CreatorOS is a MERN stack web application that transforms a rough content idea into a structured, brand-consistent, editable social media creative. It is designed around the workflow:

```text
messy idea -> structured narrative -> multi-slide creative -> visual editing -> export
```

The product is inspired by a focused combination of Canva, ChatGPT, and AI visual generation, but it is not just a text generator. The main goal is to help a creator turn an unclear thought into a publish-ready carousel, post, or story.

## Live Deployment

Frontend:

```text
https://the-social-media-studio-client.vercel.app
```

Backend:

```text
https://the-social-media-studio.onrender.com
```

Backend health check:

```text
https://the-social-media-studio.onrender.com/health
```

## Tech Stack

### Frontend

- React
- Vite
- React Router
- Lucide React icons
- `html-to-image` for PNG export
- `jszip` for ZIP carousel export
- `file-saver` for downloading generated files

The frontend is deployed on Vercel.

### Backend

- Node.js
- Express
- MongoDB with Mongoose
- JWT authentication
- bcrypt password hashing
- Helmet security headers
- CORS
- Express rate limiting
- Gemini API support through Google AI Studio

The backend is deployed on Render.

### Database

- MongoDB Atlas in production
- Local MongoDB for development

## Main User Flow

1. User opens the frontend.
2. User registers or logs in.
3. User enters a rough idea, such as:

   ```text
   Explain why kids forget math using forgetting curve, end with solution
   ```

4. Backend converts the rough idea into a structured narrative.
5. Backend generates editable slide data.
6. Frontend renders the slides in a canvas-like editor.
7. User can edit text, change layout, change style, duplicate/delete slides, rewrite copy, and regenerate visuals.
8. User can export a single slide as PNG or the whole carousel as ZIP.

## Pages

### Login Page

Path:

```text
/login
```

Features:

- Login
- Register
- JWT token storage
- Redirect after successful authentication

### Dashboard

Path:

```text
/
```

Features:

- Rough idea input
- Format selector:
  - Instagram Post
  - Carousel
  - Story
- Style selector:
  - Minimal
  - Bold
  - Educational
  - Playful
- Recent projects
- Generate creative button

### Editor Studio

Path:

```text
/studio/:projectId
```

Features:

- Slide preview canvas
- Slide thumbnails
- Edit heading
- Edit subtext
- Change layout template
- Change visual style
- Regenerate slide
- Rewrite copy:
  - Simpler
  - More engaging
  - More formal
- Duplicate slide
- Delete slide
- Add slide
- Save slides
- Export slide as PNG
- Export carousel as ZIP
- Copy caption and hashtags
- Creative intelligence panel

### Brand Settings

Path:

```text
/brand
```

Features:

- Brand name
- Brand colors
- Heading font
- Body font
- Tone of voice
- Brand preview

## Backend API

Base URL in production:

```text
https://the-social-media-studio.onrender.com
```

Frontend environment variable:

```env
VITE_API_URL=https://the-social-media-studio.onrender.com
```

Important: do not add `/api` to `VITE_API_URL`, because the frontend already calls routes such as `/api/auth/login`.

### Health

```http
GET /health
```

Returns:

```json
{
  "ok": true,
  "name": "CreatorOS API"
}
```

### Auth Routes

Base path:

```text
/api/auth
```

#### Register

```http
POST /api/auth/register
```

Body:

```json
{
  "name": "Creator",
  "email": "creator@example.com",
  "password": "password123"
}
```

Returns:

```json
{
  "token": "jwt-token",
  "user": {
    "id": "user-id",
    "name": "Creator",
    "email": "creator@example.com"
  }
}
```

#### Login

```http
POST /api/auth/login
```

Body:

```json
{
  "email": "creator@example.com",
  "password": "password123"
}
```

Returns a JWT token and user object.

#### Current User

```http
GET /api/auth/me
```

Requires:

```http
Authorization: Bearer <token>
```

### Brand Routes

Base path:

```text
/api/brand
```

All brand routes require JWT authentication.

#### Get Brand

```http
GET /api/brand
```

Returns the user brand profile.

#### Update Brand

```http
PUT /api/brand
```

Body:

```json
{
  "name": "Creator Brand",
  "colors": ["#111827", "#f97316", "#14b8a6", "#f8fafc"],
  "fonts": {
    "heading": "Inter",
    "body": "Inter"
  },
  "toneOfVoice": "clear, practical, optimistic",
  "logoUrl": ""
}
```

### Project Routes

Base path:

```text
/api/projects
```

All project routes require JWT authentication.

#### List Projects

```http
GET /api/projects
```

Returns the latest projects for the authenticated user.

#### Generate Project

```http
POST /api/projects/generate
```

Body:

```json
{
  "roughIdea": "Explain why kids forget math using forgetting curve, end with solution",
  "format": "carousel",
  "style": "educational"
}
```

Supported formats:

```text
post
carousel
story
```

Supported styles:

```text
minimal
bold
educational
playful
```

Returns:

```json
{
  "project": {},
  "slides": []
}
```

#### Get Project

```http
GET /api/projects/:id
```

Returns the project and its slides.

#### Save Slides

```http
PUT /api/projects/:id/slides
```

Saves the current slide state after editing.

#### Regenerate Slide

```http
POST /api/projects/:id/regenerate-slide/:slideId
```

Regenerates a slide's visual/style content.

#### Rewrite Slide

```http
POST /api/projects/:id/rewrite-slide/:slideId
```

Body:

```json
{
  "mode": "simpler"
}
```

Supported rewrite modes:

```text
simpler
engaging
formal
```

## Database Models

### User

File:

```text
server/src/models/User.js
```

Fields:

- `name`
- `email`
- `passwordHash`
- timestamps

Passwords are hashed using bcrypt before storage.

### BrandProfile

File:

```text
server/src/models/BrandProfile.js
```

Fields:

- `user`
- `name`
- `colors`
- `fonts.heading`
- `fonts.body`
- `toneOfVoice`
- `logoUrl`
- timestamps

This model controls brand consistency across generated creatives.

### Project

File:

```text
server/src/models/Project.js
```

Fields:

- `user`
- `title`
- `format`
- `roughIdea`
- `style`
- `themeMode`
- `narrative`
- `intelligence`
- `caption`
- `hashtags`
- `ctas`
- `shareId`
- timestamps

The `narrative` object stores:

- `hook`
- `storyline`
- `slideBreakdown`
- `tone`
- `targetAudience`

The `intelligence` object stores:

- `hookStrength`
- `readability`
- `engagementPrediction`
- `suggestions`

### Slide

File:

```text
server/src/models/Slide.js
```

Fields:

- `project`
- `index`
- `heading`
- `subtext`
- `visualTheme`
- `layoutType`
- `imagePrompt`
- `imageUrl`
- `background`
- `notes`
- `meta`
- timestamps

Supported layout types:

```text
title-heavy
split-text-image
quote-style
infographic-style
```

## AI System

CreatorOS uses a backend-only AI layer. API keys are never used in the frontend.

### Gemini Text Generation

File:

```text
server/src/services/geminiService.js
```

Environment variables:

```env
GOOGLE_AI_API_KEY=
GOOGLE_TEXT_MODEL=gemini-2.5-flash-lite
GOOGLE_IMAGE_MODEL=gemini-2.5-flash-image
```

The backend tries Gemini first for:

- narrative generation
- slide generation

If Gemini fails because of quota, network, invalid key, or parsing, the backend automatically uses the local fallback engine. This keeps the app working during demos.

### Local Fallback Engine

File:

```text
server/src/services/creativeEngine.js
```

The fallback engine provides:

- narrative generation
- slide generation
- visual placeholder generation
- creative intelligence scoring
- caption generation
- hashtag generation
- CTA generation
- copy rewrite modes

This means the project can still run even without a paid AI provider.

### Image Generation

Currently, real external image generation is not required. The app uses generated SVG/data visuals as a safe fallback.

The env variable exists for future use:

```env
IMAGE_API_KEY=
```

For the current Gemini setup, this can remain empty.

Future option:

- Use `GOOGLE_AI_API_KEY` and `GOOGLE_IMAGE_MODEL` for Gemini image generation.
- Or connect a separate image provider such as Replicate, Stability AI, or another image API.

## Environment Variables

### Backend Local

File:

```text
server/.env
```

Example:

```env
PORT=8081
MONGO_URI=mongodb://127.0.0.1:27017/creatoros
JWT_SECRET=creatoros-local-dev-secret-change-before-production
CLIENT_URL=http://localhost:5174
GOOGLE_AI_API_KEY=your-google-ai-studio-key
GOOGLE_TEXT_MODEL=gemini-2.5-flash-lite
GOOGLE_IMAGE_MODEL=gemini-2.5-flash-image
IMAGE_API_KEY=
```

Never commit this file.

### Frontend Local

File:

```text
client/.env
```

Example:

```env
VITE_API_URL=http://localhost:8081
```

### Render Backend Production

Set these in the Render dashboard:

```env
MONGO_URI=your-mongodb-atlas-url
JWT_SECRET=long-random-production-secret
CLIENT_URL=https://the-social-media-studio-client.vercel.app
GOOGLE_AI_API_KEY=your-rotated-google-ai-studio-key
GOOGLE_TEXT_MODEL=gemini-2.5-flash-lite
GOOGLE_IMAGE_MODEL=gemini-2.5-flash-image
IMAGE_API_KEY=
```

Do not manually set `PORT` on Render unless required. Render provides it automatically.

### Vercel Frontend Production

Set this in the Vercel dashboard:

```env
VITE_API_URL=https://the-social-media-studio.onrender.com
```

Do not add `/api` at the end.

Correct:

```env
VITE_API_URL=https://the-social-media-studio.onrender.com
```

Wrong:

```env
VITE_API_URL=https://the-social-media-studio.onrender.com/api
```

## Security Notes

- `.env` files are ignored by Git.
- API keys stay on the backend only.
- JWT is used for authentication.
- Passwords are hashed with bcrypt.
- Helmet is enabled for security headers.
- Rate limiting is enabled.
- CORS allows the configured frontend URL.

Important:

If an API key is pasted into a public chat, screenshot, GitHub issue, or public repo, rotate it immediately. Rotating means deleting/revoking the old key and creating a new one.

## Deployment Guide

### Backend On Render

1. Push the project to GitHub.
2. Open Render.
3. Create a new Web Service.
4. Connect the GitHub repo.
5. Configure:

```text
Root Directory: server
Runtime: Node
Build Command: npm install
Start Command: npm start
```

6. Add the Render environment variables listed above.
7. Deploy.
8. Test:

```text
https://the-social-media-studio.onrender.com/health
```

### Frontend On Vercel

1. Open Vercel.
2. Import the same GitHub repo.
3. Configure:

```text
Root Directory: client
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

4. Add:

```env
VITE_API_URL=https://the-social-media-studio.onrender.com
```

5. Deploy.
6. Test:

```text
https://the-social-media-studio-client.vercel.app/login
```

7. Go back to Render and make sure:

```env
CLIENT_URL=https://the-social-media-studio-client.vercel.app
```

8. Redeploy backend after updating `CLIENT_URL`.

## Local Development

Install dependencies:

```bash
npm install
```

Run backend:

```bash
npm.cmd run start --workspace server
```

Run frontend:

```bash
npm.cmd run dev --workspace client
```

Local URLs:

```text
Frontend: http://localhost:5174
Backend: http://localhost:8081
```

## Testing Checklist

Use this checklist after local or production deployment:

- Health route works.
- Register works.
- Login works.
- JWT token is stored.
- Dashboard opens after login.
- Rough idea input works.
- Creative generation returns a project.
- Editor opens generated slides.
- Slide text can be edited.
- Slides can be saved.
- Slide can be duplicated.
- Slide can be deleted.
- Copy rewrite works.
- Regenerate slide works.
- Brand settings can be saved.
- PNG export works.
- ZIP export works.
- Caption copy works.

## Known Limitations

This is a strong MVP, but these areas can be improved before a larger production launch:

- Add password reset.
- Add email verification.
- Add refresh tokens.
- Add stronger per-user generation quotas.
- Add real persistent image storage.
- Add real Gemini image generation.
- Add error boundaries on the frontend.
- Add automated backend tests.
- Add automated frontend tests.
- Add project sharing permissions.
- Add version history.
- Add team collaboration.

## Current Working Status

Verified locally:

- Frontend production build passes.
- Frontend lint passes.
- Backend JavaScript syntax check passes.
- Auth routes exist.
- Project generation route exists.
- Gemini integration exists with fallback.
- SVG visual fallback exists.
- Export tools exist in frontend.
- Deployment environment variable structure is ready.

The project is ready for demo deployment on Vercel and Render. For production with real users, improve authentication recovery, error handling, tests, quotas, and image storage.
