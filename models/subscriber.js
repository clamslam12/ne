"use strict";

const mongoose = require("mongoose"),
  //define a schema
  subscriberSchema = mongoose.Schema({
    name: String,
    email: String,
    zipCode: Number,
  });
//apply schema to model
module.exports = mongoose.model("Subscriber", subscriberSchema);
