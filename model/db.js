const mongoose = require("mongoose");
require("dotenv").config();
const connection = mongoose.connect(process.env.mongoUrl);

const userSchema = mongoose.Schema({
  Profilepicture: String,
  Name: String,
  Bio: String,
  Phone: Number,
  Email: String,
  Password: String,
});

const UserModel=mongoose.model("users",userSchema);

module.exports={
    connection,UserModel
}
