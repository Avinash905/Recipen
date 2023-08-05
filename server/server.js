require("dotenv").config();
require("./db/conn");
const express = require("express");

const port = process.env.PORT || 5000;
const app = express();

// middleware for json
app.use(express.json());

// route middleware
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/recipe", require("./routes/recipeRoutes"));
app.use("/api/blog", require("./routes/blogRoutes"));

app.listen(port, () => {
  console.log(`Server running on ${port}`);
});
