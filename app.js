"use strict";

import morgan from "morgan";
import express from "express";
import sanitizeMongo from "express-mongo-sanitize";
import studentsRouter from "./routes/students.js";
import coursesRouter from "./routes/courses.js";
import authRouter from "./routes/auth/index.js";

import connectDatabase from "./startup/connectDatabase.js";
connectDatabase();

const app = express();

app.use(morgan("tiny"));
app.use(express.json());
app.use(sanitizeMongo());

app.use("/auth", authRouter);
app.use("/api/students", studentsRouter);
app.use("/api/courses", coursesRouter);

export default app;
