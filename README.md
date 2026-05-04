# Tempo — AI Travel Planner

Tempo is an AI-powered travel planning app that generates personalised day-by-day itineraries based on destination, budget, travel dates, and preferences. Users can share trips with others, request voice-based itinerary changes, and manage all their saved plans in one place.

![Tempo Screenshot](/tempo/src/assets/cover-image.jpeg)

---

## Features

- AI-generated itineraries via Gemini 2.0 Flash
- Smart hotel suggestions via Google Places API
- Voice-based itinerary update requests (Google Cloud Speech-to-Text)
- Trip sharing with view/edit permission levels
- Paginated trip history
- Secure session-based authentication

---

## Tech Stack

| Layer       | Technology                                      |
|-------------|------------------------------------------------|
| Frontend    | React + TypeScript, Tailwind CSS, Vite          |
| Backend     | Node.js, Express, TypeScript                    |
| Database    | MongoDB Atlas (Mongoose)                        |
| AI          | Google Gemini 2.0 Flash                         |
| Maps        | Google Places API                               |
| Speech      | Google Cloud Speech-to-Text                     |
| Email       | Nodemailer + SendGrid                           |
| Hosting     | Render                                          |

---

## Backend Architecture

The backend is a RESTful API built with Express and TypeScript, structured around a clear router → controller → database layer separation.

### Security
- **HTTP-only cookies** with `SameSite` and `Secure` flags for session tokens — prevents XSS-based session hijacking
- **bcrypt** (10 rounds) for password hashing
- **Helmet** for secure HTTP response headers
- **CORS** locked to the frontend origin with `credentials: true`
- **Rate limiting** per endpoint — 5 login attempts / 15 min, 3 registrations / hour / IP, 10 AI requests / hour

### Validation
- All request bodies validated with **Zod schemas** before reaching controllers
- A shared `validate` middleware returns structured field-level error messages

### Reliability
- **Async error handler** wrapper on all controllers — unhandled promise rejections flow into the global error handler instead of crashing the process
- **AI retry logic** with exponential backoff (up to 3 attempts) for Gemini API calls
- **Health check endpoint** (`GET /health`) — reports server uptime, timestamp, and database connection state

### Performance
- **Compound index** on `(userId, createdAt)` for trip queries — avoids full collection scans
- **Unique index** on `email` and an index on `sessionToken` for user lookups on every authenticated request
- **Paginated** `GET /trips` — returns 10 trips per page by default, capped at 50 per request, with total count and page metadata
- List endpoint **excludes the `generatedItinerary` field** — the large AI-generated blob only loads on the detail page

### Observability
- **Morgan** HTTP request logging — `dev` format in development, `combined` (Apache) in production

---

## API Endpoints

| Method | Endpoint                    | Auth | Description                        |
|--------|-----------------------------|------|------------------------------------|
| GET    | `/health`                   | No   | Server and DB health status        |
| POST   | `/auth/register`            | No   | Register a new user                |
| POST   | `/auth/login`               | No   | Login and receive session cookie   |
| POST   | `/auth/logout`              | No   | Clear session cookie               |
| GET    | `/me`                       | Yes  | Check authentication status        |
| POST   | `/ai/create-trip`           | Yes  | Generate a new AI itinerary        |
| POST   | `/ai/update-trip/:tripId`   | Yes  | Modify an existing itinerary       |
| GET    | `/trips`                    | Yes  | Get paginated list of user trips   |
| GET    | `/trip-details/:tripId`     | Yes  | Get full trip with itinerary       |
| POST   | `/trips/:tripId/share`      | Yes  | Share a trip (view/edit)           |
| POST   | `/lookup-place`             | Yes  | Search Google Places               |
| POST   | `/transcribe`               | Yes  | Transcribe audio to text           |
| PATCH  | `/users/:id`                | Yes  | Update username                    |
| DELETE | `/users/:id`                | Yes  | Delete account                     |

---

## Project Structure

```
tempo/
├── backend/
│   ├── src/
│   │   ├── controllers/       # Request handlers
│   │   ├── db/                # Mongoose models and queries
│   │   ├── helpers/           # Zod schemas, AI prompts, utilities
│   │   ├── middlewares/       # Auth, validation, rate limiting
│   │   └── router/            # Route definitions
│   ├── .env.example           # Required environment variables
│   └── tsconfig.json
└── tempo/                     # React + Vite frontend
    └── src/
```

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/swathysukumaran/tempo.git
cd tempo
```

### 2. Install dependencies

```bash
# Frontend
cd tempo && npm install

# Backend
cd ../backend && npm install
```

### 3. Configure environment variables

Copy `.env.example` to `.env` in the `backend/` directory and fill in your values:

```bash
cp backend/.env.example backend/.env
```

| Variable                        | Description                                 |
|---------------------------------|---------------------------------------------|
| `PORT`                          | Server port (default: 8081)                 |
| `NODE_ENV`                      | `development` or `production`               |
| `MONGO_URI`                     | MongoDB Atlas connection string             |
| `FRONTEND_URL`                  | Frontend origin for CORS                    |
| `GEMINI_API_KEY`                | Google Gemini API key                       |
| `GOOGLE_API_KEY`                | Google Places API key                       |
| `GOOGLE_APPLICATION_CREDENTIALS`| Path to Google Cloud service account JSON   |
| `SENDGRID_API_KEY`              | SendGrid API key                            |
| `SENDER_EMAIL`                  | From address for trip share emails          |

### 4. Run development servers

```bash
# Backend
cd backend && npm run dev

# Frontend (separate terminal)
cd tempo && npm run dev
```

---

## Deployment

Deployed on **Render** (frontend as a static site, backend as a web service).

Frontend requires a `static.json` at the root of the `tempo/` directory so React Router handles all routes client-side:

```json
{
  "root": "dist/",
  "routes": { "/**": "index.html" }
}
```

> **Note:** The live demo is currently offline due to Google Cloud billing limits.

---

## Author

**Swathy Sukumaran**
MERN Stack Developer
[LinkedIn](https://www.linkedin.com/in/swathy-sukumaran-v-1190b7233/) · [Portfolio](https://portfolio-y2bu.onrender.com/)

---

## License

[MIT](LICENSE)
