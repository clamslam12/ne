"use strict";

const mongoose = require("mongoose"),
  Course = require("./course"),
  //define a schema
  subscriberSchema = mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
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
      courses: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Course",
        },
      ],
    },
    { timestamps: true }
  );
//define instance methods
//
//Note: arrow functions dont work with mongoose
subscriberSchema.methods.getInfo = function () {
  return `Name: ${this.name} Email: ${this.email} Zipcode: ${this.zipCode}`;
};
//apply schema to model
module.exports = mongoose.model("Subscriber", subscriberSchema);
