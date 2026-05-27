import express from 'express';
import cors from 'cors';
import { env } from './config/env'
import assignmentRoutes from './routes/assignment.routes'
import {
  errorHandler,
  notFoundHandler,
} from "./middlewares/error.middleware";

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

app.use("/api/assignments", assignmentRoutes);


app.use(notFoundHandler);
app.use(errorHandler);


export default app;