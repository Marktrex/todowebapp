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

  const hash = await bcrypt.hash(password,10);
  const code = Math.floor(100000 + Math.random()*900000);

  await User.create({ email, password:hash, code });
  
  const transporter = await getTransporter();
  await transporter.sendMail({
    to: email,
    subject: "Verify Code",
    text: "Your code: " + code
  });

  res.json("Registered. Check email.");
});


// VERIFY
router.post("/verify", async(req,res)=>{
  const {email,code} = req.body;

  const user = await User.findOne({email});

  if(user.code == code){
    user.verified = true;
    await user.save();
    return res.json("Verified");
  }

  res.json("Wrong code");
});


// LOGIN
router.post("/login", async(req,res)=>{
  const {email,password} = req.body;

  const user = await User.findOne({email});
  if(!user || !user.verified) return res.json("Not verified");

  const match = await bcrypt.compare(password,user.password);
  if(!match) return res.json("Wrong password");

  const token = jwt.sign({id:user._id},SECRET);
  res.json({token});
});

module.exports = router;
