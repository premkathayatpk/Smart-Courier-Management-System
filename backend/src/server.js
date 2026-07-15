import 'dotenv/config';
import http from "http";
import app from "./app.js";
import connectDB from "./config/db.js";

//Connect DB
connectDB();

const server = http.createServer(app);

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
