const mongoose = require("mongoose");

const EmailConfigSchema = new mongoose.Schema({
  email: String,
  password: String
});

module.exports = mongoose.model("EmailConfig", EmailConfigSchema);
