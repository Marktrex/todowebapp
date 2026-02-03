const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../models/user");
const EmailConfig = require("../models/emailconfig");

const router = express.Router();
const SECRET = process.env.JWT_SECRET;

async function getTransporter(){
  const config = await EmailConfig.findOne();
  if(!config) throw new Error("Email config not found in DB");

  return nodemailer.createTransport({
    service: "gmail",
    auth:{
      user: config.email,
      pass: config.password
    }
  });
}

// REGISTER
router.post("/register", async(req,res)=>{
  const {email,password} = req.body;
  
  const exists = await User.findOne({email});
  // 409 Conflict: The email is already taken
  if(exists) return res.status(409).json({ message: "Email already registered" });

  const hash = await bcrypt.hash(password,10);
  const code = Math.floor(100000 + Math.random()*900000);

  await User.create({ email, password:hash, code });
  
  try {
    const transporter = await getTransporter();
    await transporter.sendMail({
      to: email,
      subject: "Verify Code",
      text: "Your code: " + code
    });
    // 201 Created: Standard for successful registration
    res.status(201).json({ message: "Registered. Check email." });
  } catch (error) {
    // 500 Internal Server Error: If the email fails to send
    res.status(500).json({ message: "User created but email failed to send" });
  }
});

// VERIFY
router.post("/verify", async(req,res)=>{
  const {email,code} = req.body;
  const user = await User.findOne({email});

  if(!user) return res.status(404).json({ message: "User not found" });

  if(user.code == code){
    user.verified = true;
    await user.save();
    // 200 OK: Request succeeded
    return res.status(200).json({ message: "Verified" });
  }

  // 400 Bad Request: The client sent the wrong code
  res.status(400).json({ message: "Wrong code" });
});

// LOGIN
router.post("/login", async(req,res)=>{
  const {email,password} = req.body;

  const user = await User.findOne({email});
  
  // 401 Unauthorized: Credentials (email/password) are wrong
  if(!user) return res.status(401).json({ message: "Invalid credentials" });
  
  // 403 Forbidden: User is known but "blocked" because they aren't verified
  if(!user.verified) return res.status(403).json({ message: "Account not verified" });

  const match = await bcrypt.compare(password,user.password);
  if(!match) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign({ userId: user._id }, SECRET);
  // 200 OK: Standard for successful login
  res.status(200).json({ token });
});

module.exports = router;