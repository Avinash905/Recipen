require("dotenv").config();
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const express = require("express");
const errorHandler = require("./middleware/errorHandler");
const credentials = require("./middleware/credentials");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const connectDB = require("./db/conn");

const app = express();
const port = process.env.PORT || 5000;

// cors middleware
app.use(credentials);
app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

app.use(express.json());

// route middleware
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/recipe", require("./routes/recipeRoutes"));
app.use("/api/blog", require("./routes/blogRoutes"));
app.use("/api/stripe", require("./routes/subscriptionRoutes"));

app.use(errorHandler);

connectDB()
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(port, () => console.log(`Server running on port ${port}`));
  })
  .catch((err) => {
    console.error(`Error connecting to MongoDB ${err}`);
  });
