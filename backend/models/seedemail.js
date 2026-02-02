const mongoose = require("mongoose");
const EmailConfig = require("./models/EmailConfig");

mongoose.connect("mongodb://127.0.0.1:27017/todoapp");

async function run(){
  await EmailConfig.create({
    email: "careerhub.gitpushers@gmail.com",
    password: "CS76@Gitpushers"
  });

  console.log("Email saved");
  process.exit();
}

run();
