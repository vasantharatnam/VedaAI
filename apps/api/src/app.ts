import express from 'express';
import cors from 'cors';
import { env } from './config/env'

const app = express();

app.use(
  cors({
    origin: env.frontendUrl || "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "VedaAI Assessment Creator API is running",
    service: "assessment-creator-api",
  });
});

export default app;