require("dotenv").config();
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const express = require("express");
const errorHandler = require("./middleware/errorHandler");
const credentials = require("./middleware/credentials");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const connectDB = require("./db/conn");
const User = require("./models/userModel");
const Session = require("./models/sessionModel");
const allowedOrigins = require("./config/allowedOrigins");

const app = express();
const port = process.env.PORT || 5000;

app.disable("x-powered-by");
app.use((req, res, next) => {
  res.set("X-Content-Type-Options", "nosniff");
  res.set("X-Frame-Options", "DENY");
  res.set("Referrer-Policy", "strict-origin-when-cross-origin");
  const origin = req.get("Origin");
  if (origin && !allowedOrigins.includes(origin)) return res.status(403).json({ message: "Origin not allowed." });
  next();
});

// cors middleware
app.use(credentials);
app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

app.use(express.json());

app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.get("/api/ready", (req, res) => {
  const ready = mongoose.connection.readyState === 1;
  res.status(ready ? 200 : 503).json({ status: ready ? "ready" : "unavailable" });
});

// route middleware
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/recipe", require("./routes/recipeRoutes"));
app.use("/api/blog", require("./routes/blogRoutes"));
app.use("/api/stripe", require("./routes/subscriptionRoutes"));

app.use(errorHandler);

connectDB()
  .then(async () => {
    await User.createIndexes();
    await Session.createIndexes();
    console.log("Connected to MongoDB");
    app.listen(port, () => console.log(`Server running on port ${port}`));
  })
  .catch(async (err) => {
    console.error(`Error connecting to MongoDB ${err}`);
    process.exitCode = 1;
    await mongoose.disconnect();
  });
