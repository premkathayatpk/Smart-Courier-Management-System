import express from "express";
// import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";

const app = express();

//Middleware
app.use(express.json());

app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

//APIs
// app.get("/", (req, res) => {
//   res.json({
//     message: "Courier API Running",
//   });
// });

app.use('/api/auth',authRouter)

export default app;
