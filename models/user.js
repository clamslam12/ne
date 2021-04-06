"use strict";

const mongoose = require("mongoose");
//import Schema module from mongoose
const { Schema } = mongoose;
const Subscriber = require("./subscriber");
const Course = require("./course");

const userSchema = new Schema(
  {
    name: {
      first: {
        type: String,
        required: true,
      },
      last: {
        type: String,
        required: true,
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    zipCode: {
      type: Number,
      min: [10000, "Zip code too short"],
      max: 99999,
    },
    password: {
      type: String,
      required: true,
    },
    courses: [
      {
        type: Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
    subscribedAccount: { type: Schema.Types.ObjectId, ref: "Subscriber" },
  },
  { timestamps: true }
);
//adding virtual method (computed method; not stored in database)
//
//cant use arrow function with mongoose
userSchema.virtual("fullName").get(function () {
  return `${this.name.first} ${this.name.last}`;
});
//pre hooks; runs before a mongoose operation like save, create, etc...
//
//use next to continue with mongoose operation/middleware in the chain
//tries to associate a new user with an existing subscriber account before saving to database
userSchema.pre("save", function (next) {
  if (this.subscribedAccount == undefined) {
    Subscriber.findOne({
      email: this.email,
    })
      .then((subscriber) => {
        this.subscribedAccount = subscriber;
        next();
      })
      .catch((error) => {
        console.log(`Error in associating subscriber: ${error.message}`);
        next(error);
      });
  } else {
    next();
  }
});

module.exports = mongoose.model("User", userSchema);
