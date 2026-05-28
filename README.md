# VedaAI Assessment Creator

AI-powered assessment creator for teachers. Teachers create assignments, the backend generates a structured question paper with Groq, and the frontend renders the result with live generation status updates.

## Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- Zustand
- Socket.IO client

### Backend

- Node.js
- Express
- TypeScript
- MongoDB
- Redis
- BullMQ
- Socket.IO
- PDFKit
- Zod
- Groq API

## Core Flow

```txt
Teacher creates assignment
  -> Backend stores assignment
  -> BullMQ job starts
  -> Worker calls Groq
  -> AI JSON is parsed and validated with Zod
  -> Structured result is stored in MongoDB
  -> Frontend receives Socket.IO updates
  -> Question paper output and PDF download are available
```

The application does not render raw AI responses. AI output is parsed, normalized, validated, stored as structured JSON, and then rendered through typed UI components.

## Prerequisites

- Node.js 20.9 or newer for the web app
- npm
- Docker, for local MongoDB and Redis
- Groq API key

## Environment Setup

Copy the example environment file and fill in the required values.

```bash
cp .env.example apps/api/.env
```

Required backend values:

```env
PORT=4000
FRONTEND_URL=http://localhost:3000
MONGODB_URI=mongodb://localhost:27017/vedaai_assessment_creator
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
AI_PROVIDER=GroqApi
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=llama-3.3-70b-versatile
```

Required frontend values in `apps/web/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_WS_URL=http://localhost:4000
```

## Local Setup

Install dependencies:

```bash
npm install
```

Start MongoDB and Redis:

```bash
npm run docker:up
```

Start the API:

```bash
npm run dev:api
```

Start the web app in another terminal:

```bash
npm run dev:web
```

Open the frontend at:

```txt
http://localhost:3000
```

## Scripts

```bash
npm run dev:web      # Start Next.js web app
npm run dev:api      # Start Express API and generation worker
npm run build        # Build all workspaces
npm run lint         # Lint all workspaces
npm run docker:up    # Start MongoDB and Redis
npm run docker:down  # Stop MongoDB and Redis
npm run docker:logs  # Follow Docker logs
```

## Local Infrastructure

The backend requires MongoDB and Redis.

MongoDB stores:

- Assignment records
- Generated question paper results

Redis is used for:

- BullMQ job queue
- Background generation state
- Worker coordination

## AI Generation

Generation is Groq-only. The backend calls Groq's OpenAI-compatible chat completions endpoint:

```txt
https://api.groq.com/openai/v1/chat/completions
```

The worker requests JSON object output, parses the response, normalizes small shape differences, validates the final object with Zod, and stores only valid structured data.

If Groq credits or quota are exhausted, generation fails with:

```txt
credit usage of groq completed
```

There is no mock question paper fallback.

## API Routes

### Assignments

```txt
POST   /api/assignments
GET    /api/assignments
GET    /api/assignments/:assignmentId
DELETE /api/assignments/:assignmentId
GET    /api/assignments/:assignmentId/status
GET    /api/assignments/:assignmentId/result
POST   /api/assignments/:assignmentId/regenerate
GET    /api/assignments/:assignmentId/pdf
```

### Create Assignment

Creates an assignment and queues background question paper generation.

```txt
POST /api/assignments
```

### Regenerate Assignment

Queues a new generation job for an existing assignment.

```txt
POST /api/assignments/:assignmentId/regenerate
```

### Download PDF

Downloads the generated question paper as a PDF.

```txt
GET /api/assignments/:assignmentId/pdf
```

## WebSocket Events

The backend uses Socket.IO for real-time generation updates.

Client joins an assignment room:

```ts
socket.emit("assignment:join", assignmentId);
```

Server emits:

```txt
generation:status
generation:completed
generation:failed
```

The frontend uses these events to update progress and fetch the final result after generation completes.

## Project Structure

```txt
apps/
  api/
    src/
      config/        # Env, MongoDB, Redis
      controllers/   # Express controllers
      models/        # Mongoose models
      queues/        # BullMQ queue setup
      routes/        # Express routes
      schemas/       # Zod schemas
      services/      # AI generation, prompt building, PDF generation
      socket/        # Socket.IO server helpers
      workers/       # Background generation worker
  web/
    src/
      app/           # Next.js app routes
      components/    # UI and assignment components
      hooks/         # Socket hooks
      lib/           # API/env utilities
      store/         # Zustand form store
      types/         # Frontend types
packages/
  shared/
```

## Troubleshooting

### Generation still uses old configuration

Restart the API process after changing `.env`. The worker reads environment variables at startup.

### Groq credit error

If the API returns `credit usage of groq completed`, check Groq billing, quota, or API key status.

### MongoDB or Redis connection errors

Start infrastructure:

```bash
npm run docker:up
```

Check logs:

```bash
npm run docker:logs
```

### Web build requires newer Node

Next.js requires Node.js 20.9 or newer. Upgrade Node if the web build fails with a Node version error.
