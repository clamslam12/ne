"use strict";

const mongoose = require("mongoose"),
  { Schema } = mongoose;
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
userSchema.virtual("fullName").get(() => {
  return `${this.name.first} ${this.name.last}`;
});

module.exports = mongoose.model("User", userSchema);
