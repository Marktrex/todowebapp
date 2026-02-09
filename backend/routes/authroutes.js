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
  if(!config) throw new Error("No email config found in DB");

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

  await User.create({ email, password:hash, code, verified:false });
  
  const transporter = await getTransporter();
  await transporter.sendMail({
    to: email,
    subject: "Verify Code",
    text: "Your code: " + code
  });

  res.json({message:"Registered. Check email."});
});

// VERIFY
router.post("/verify", async(req,res)=>{
  const {email,code} = req.body;

  const user = await User.findOne({email});
  if(!user) return res.status(400).json({message:"User not found"});

  if(user.code == code){
    user.verified = true;
    await user.save();
    return res.json({message:"Verified"});
  }

  res.status(400).json({message:"Wrong code"});
});

// LOGIN
router.post("/login", async(req,res)=>{
  const {email,password} = req.body;

  const user = await User.findOne({email});
  if(!user || !user.verified) return res.status(401).json({message:"Not verified"});

  const match = await bcrypt.compare(password,user.password);
  if(!match) return res.status(401).json({message:"Wrong password"});

  const token = jwt.sign({id:user._id},SECRET, {expiresIn:"1h"});
  res.json({token});
});

// CHANGE PASSWORD
router.post("/change-password", async(req,res)=>{
  const authHeader = req.headers.authorization;
  if(!authHeader) return res.status(401).json({message:"No token"});

  const token = authHeader.split(" ")[1];
  try{
    const decoded = jwt.verify(token, SECRET);
    const user = await User.findById(decoded.id);
    if(!user) return res.status(404).json({message:"User not found"});

    const {oldPassword,newPassword} = req.body;
    const match = await bcrypt.compare(oldPassword,user.password);
    if(!match) return res.status(400).json({message:"Wrong old password"});

    user.password = await bcrypt.hash(newPassword,10);
    await user.save();

    res.json({message:"Password changed"});
  } catch(err){
    res.status(401).json({message:"Invalid token"});
  }
});

// DELETE ACCOUNT
router.post("/delete-account", async(req,res)=>{
  const authHeader = req.headers.authorization;
  if(!authHeader) return res.status(401).json({message:"No token"});

  const token = authHeader.split(" ")[1];
  try{
    const decoded = jwt.verify(token, SECRET);
    await User.findByIdAndDelete(decoded.id);
    res.json({message:"Account deleted"});
  } catch(err){
    res.status(401).json({message:"Invalid token"});
  }
});

module.exports = router;
