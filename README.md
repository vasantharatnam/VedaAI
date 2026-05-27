# VedaAI Assessment Creator

AI-powered assessment creator for teachers.

## Tech Stack

### Frontend
- Next.js
- TypeScript
- Tailwind CSS
- Zustand
- WebSocket client

### Backend
- Node.js
- Express
- TypeScript
- MongoDB
- Redis
- BullMQ
- Socket.IO

## Core Flow

Teacher creates assignment → backend stores assignment → BullMQ job starts → AI generates structured question paper → result is stored → frontend receives WebSocket update → structured output page is rendered.

## Important Rule

The application does not directly render raw AI responses.

AI output is parsed, validated, stored as structured JSON, and then rendered using typed UI components.

## Local Setup

```bash
npm install
npm run dev:web
npm run dev:api

## Local Infrastructure

The backend requires MongoDB and Redis.

Start them using:

```bash
npm run docker:up

## Backend Connections

The Express backend connects to MongoDB and Redis during startup.

MongoDB is used for:

- Assignment records
- Generated structured question papers

Redis is used for:

- BullMQ job queue
- Background generation state
- Worker coordination

Run infrastructure first:

```bash
npm run docker:up