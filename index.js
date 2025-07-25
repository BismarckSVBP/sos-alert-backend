





// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import cookieParser from "cookie-parser";
// import path from "path";
// import http from "http";

// import { connectDB } from "./db/connectDB.js";
// import authRoutes from "./routes/auth.route.js";
// import sharingEmail from "./routes/sharingEmail.route.js";
// import initSocket from "./socket/socket.js";

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;
// const __dirname = path.resolve();

// // CORS
// app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
// app.use(express.json());
// app.use(cookieParser());

// // ✅ Create HTTP server for socket.io
// const server = http.createServer(app);

// // ✅ Initialize Socket.IO and bind to server
// const io = initSocket(server);

// // ✅ Attach socket instance to req BEFORE ROUTES
// app.use((req, res, next) => {
//   req.io = io;
//   next();
// });

// // ✅ Now register routes
// app.use("/api/auth", authRoutes);

// app.use("/api/email/", sharingEmail);
// // ✅ Serve frontend if in production
// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "/frontend/dist")));
//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
//   });
// }

// // ✅ Start Server + DB
// server.listen(PORT, async () => {
//   await connectDB();
//   console.log(`🚀 Server running at  ${process.env.CLIENT_URL}`);
// });
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import path from "path";

import { connectDB } from "./db/connectDB.js";
import authRoutes from "./routes/auth.route.js";
import sharingEmail from "./routes/sharingEmail.route.js";
import initSocket from "./socket/socket.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

// ✅ CORS Configuration for Render (API) + Vercel (Frontend)
const allowedOrigins = [
  "https://sos-web-pied.vercel.app",
  "https://sos-alert-beta.vercel.app",       // ✅ Frontend (Vercel production)
  "https://sos-alert-beta.onrender.com",     // ✅ If frontend is also deployed on Render
  "http://localhost:3000",                   // ✅ Local dev
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`❌ Not allowed by CORS: ${origin}`));
    }
  },
  credentials: true,
}));

// ✅ Middleware
app.use(express.json());
app.use(cookieParser());

// ✅ Create HTTP server for socket.io
const server = http.createServer(app);

// ✅ Initialize Socket.IO
const io = initSocket(server);

// ✅ Attach io instance to every request
app.use((req, res, next) => {
  req.io = io;
  next();
});

// ✅ Routes
// Keep-alive ping route
app.get('/ping', (req, res) => {
  console.log(`[${new Date().toISOString()}] Ping received`);
  res.status(200).send('OK');
});


app.use("/api/auth", authRoutes);
app.use("/api/email", sharingEmail);

// ✅ Start server and connect to DB
server.listen(PORT, async () => {
  await connectDB();
  console.log(`🚀 Server running at ${process.env.CLIENT_URL}`);
});
