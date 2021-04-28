"use strict";

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const APP_SECRET = `toes`;
const users = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String },
    role: {
      type: String,
      required: true,
      default: "user",
      enum: ["admin", "editor", "user"],
    },
  },
  { toJSON: { virtuals: true } }
);

users.virtual("token").get(function () {
  let tokenObj = {
    username: this.username,
  };
  console.log(jwt.sign(tokenObj, APP_SECRET));
  return jwt.sign(tokenObj, APP_SECRET);
});

users.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});
// basic auth
users.statics.authenticateBasic = async function (username, password) {
  const user = await this.findOne({ username });
  const valid = await bcrypt.compare(password, user.password);
  if (valid) {
    return user;
  }
  throw new Error("Invalid User");
};
// bearer auth
users.statics.authenticateToken = async function (token) {
  console.log("Reaches TOKEN", token);
  console.log(jwt.verify(token, APP_SECRET));
  const parsedToken = jwt.verify(token, APP_SECRET);
  console.log("PARSED TOKEN", parsedToken);
  const user = await this.findOne({ username: parsedToken.username });

  if (user) return user;
  throw new Error("user not found");
};
module.exports = mongoose.model("users", users);
