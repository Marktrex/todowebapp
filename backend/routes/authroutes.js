const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user");

const router = express.Router();


// REGISTER
router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    email: email,
    password: hashedPassword
  });

  await user.save();

  res.json({ message: "User registered" });
});


// LOGIN
const jwt = require("jsonwebtoken");

const JWT_SECRET = "secretcodexd"; // for testing only: next time i will use .env

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.json({ message: "User not found" });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.json({ message: "Wrong password" });
  }

    // ✅ Create token
  const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1h" });

  res.json({ message: "Login successful" });
});

module.exports = router;
