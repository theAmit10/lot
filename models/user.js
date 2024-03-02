import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter name"],
  },
  email: {
    type: String,
    required: [true, "Please enter email"],
    unique: [true, "Email already exists"],
    validate: validator.isEmail,
  },
  password: {
    type: String,
    required: [true, "Please enter password"],
    minLength: [6, "Password must be atleast 6 characters long"],
    select: false,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  avatar: {
    public_id: String,
    url: String,
  },
  otp: Number,
  otp_expire: Date,
});

// Before Saving the USER Run Below funcation
// We are encrypting user password before saving it in database

// Here scheme is a object so we can get it value by using this keyword
schema.pre("save", async function (next) {
//   console.log(this.password);
  if (!this.isModified("password")) next();
  this.password = await bcrypt.hash(this.password, 10);
});

// During login , checking password and the hash pasword in the database is matched or not
// schema.methods.comparePassword =  async function(enteredPassword){
//   return await bcrypt.compare(enteredPassword, this.password);
// }

schema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Create a method to generate token which i can use authorization
schema.methods.generateToken = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET);
};

// schema.methods.generateToken = function () {
//     jwt.sign({_id:this._id},process.env.JWT_SECRET,{
//         expiresIn: "7d"
//     })
// }

export const User = mongoose.model("User", schema);
