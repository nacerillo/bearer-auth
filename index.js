"user strict";

require("dotenv").config();

const mongoose = require("mongoose");
const options = {
  userNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
};

mongoose.connect(process.env.MONGODB_URI, options);

//Start server
require("./src/server.js").start(process.env.PORT);