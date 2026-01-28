const express = require("express");
const mongoose = require("mongoose");

const app = express();

// middleware
app.use(express.json());

// connect to mongodb
mongoose.connect("mongodb://127.0.0.1:27017/todowebapp")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// routes
const authRoutes = require("./routes/authroutes");
app.use("/auth", authRoutes);

// start server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
