"use strict";

const users = require("../models/user.js");

module.exports = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      next("Invalid Login");
    }

    const token = req.headers.authorization.split(" ")[1];
    console.log("TOKEN WORKING?", token);
    const validUser = await users.authenticateToken(token);
    console.log("Valid User WORKING?", validUser);

    req.user = validUser;
    req.token = validUser.token;
    next();
  } catch (e) {
    res.status(403).send("Invalid Login");
  }
};
