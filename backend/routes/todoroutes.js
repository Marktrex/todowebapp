const express = require("express");
const jwt = require("jsonwebtoken");
const Todo = require("../models/todo"); 
const router = express.Router();
const SECRET = process.env.JWT_SECRET;

// Auth middleware
function auth(req, res, next){
  const authHeader = req.headers.authorization;
  if(!authHeader) return res.status(401).json({message:"No token"});

  const token = authHeader.split(" ")[1];
  try{
    const decoded = jwt.verify(token, SECRET);
    req.userId = decoded.id;
    next();
  } catch(err){
    return res.status(401).json({message:"Invalid token"});
  }
}

// GET user's todos
router.get("/", auth, async(req,res)=>{
  const todos = await Todo.find({user: req.userId});
  res.json(todos);
});

// CREATE todo
router.post("/", auth, async(req,res)=>{
  const {text} = req.body;
  const todo = await Todo.create({text, user:req.userId});
  res.json(todo);
});

// UPDATE todo
router.put("/:id", auth, async(req,res)=>{
  const {text} = req.body;
  const todo = await Todo.findOneAndUpdate(
    {_id:req.params.id, user:req.userId},
    {text},
    {new:true}
  );
  res.json(todo);
});

// DELETE todo
router.delete("/:id", auth, async(req,res)=>{
  await Todo.findOneAndDelete({_id:req.params.id, user:req.userId});
  res.json({message:"Deleted"});
});

module.exports = router;
