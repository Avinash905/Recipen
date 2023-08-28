const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const connectDB = () => {
  return mongoose.connect(process.env.MONGODB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
};

module.exports = connectDB;
