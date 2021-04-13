"use strict";

const mongoose = require("mongoose"),
  { Schema } = mongoose,
  Subscriber = require("./subscriber"),
  bcrypt = require("bcrypt");
//trim property is set to true to make sure that no extra whitespace is saved to the database with this property
//A new set of properties, createdAt and updatedAt, populates with dates upon the creation of a user instance and any time you change values in the model.
//The timestamps property lets Mongoose know to include the createdAt and updatedAt values, which are useful for keeping records on how and when data changes
const userSchema = new Schema(
  {
    name: {
      first: {
        type: String,
        trim: true,
      },
      last: {
        type: String,
        trim: true,
      },
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
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
    //model associations
    courses: [{ type: Schema.Types.ObjectId, ref: "Course" }], //arrays of Course ObjectIDs,
    subscribedAccount: {
      type: Schema.Types.ObjectId,
      ref: "Subscriber",
    }, //single Subscriber ObjectID
  },
  { timestamps: true }
);
//A virtual attribute (computed attribute) is similar to a regular schema property but isn’t saved in the database.
userSchema.virtual("fullName").get(function () {
  return `${this.name.first} ${this.name.last}`;
});
//Ideally, whenever a new user is created, you’d like to check for an existing subscriber with the same email address and associate the two
//Hooks allow you to perform an operation before a database change, such as save, is run
//pre("save") hook runs right before a user is created or saved. It takes the next middleware function as a parameter so that when this step is complete, it can call the next middleware function
userSchema.pre("save", function (next) {
  if (this.subscribedAccount === undefined) {
    Subscriber.findOne({
      email: this.email,
    })
      .then((subscriber) => {
        console.log(subscriber);
        this.subscribedAccount = subscriber;
        next();
      })
      .catch((error) => {
        console.log(`Error in connecting to subscriber: ${error.message}`);
        next(error);
      });
  } else {
    next();
  }
});
//bcrypt
//hash the password and save into database
userSchema.pre("save", function (next) {
  bcrypt
    .hash(this.password, 10)
    //resolves with the hashed password
    .then((hash) => {
      //set user's password to the hash
      this.password = hash;
      next();
    })
    .catch((error) => {
      console.log(`Error in hashing password: ${error.message}`);
      next(error);
    });
});
userSchema.methods.passwordComparison = function (inputPassword) {
  //returns a promise with a true or false
  return bcrypt.compare(inputPassword, this.password);
};
module.exports = mongoose.model("User", userSchema);
