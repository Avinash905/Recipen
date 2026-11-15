const allowedOrigins = [
  "https://recipen.vercel.app",
  ...(process.env.CLIENT_BASE_URL ? [process.env.CLIENT_BASE_URL.replace(/\/$/, "")] : []),
  ...(process.env.NODE_ENV === "production" ? [] : ["http://localhost:5173"]),
  "https://recipen-backend.onrender.com",
];

module.exports = allowedOrigins;
