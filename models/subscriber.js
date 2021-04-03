"use strict";

const mongoose = require("mongoose");

const subscriberSchema = new mongoose.Schema(
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
    //model associations(1-to-1, 1-to-many, many-to-many)
    //same as using foreign keys to reference another table
    //
    //each subscriber has an array of courses; can restrict to have one course by removing array, course: {type: mongoose.Schema.Types.ObjectId, ref: "Course"}

    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
  },
  { timestamps: true }
);
// Adding methods to Schema
// Because the subscriber’s schema defines how instances of the Subscriber model behave, you can also add instance and static methods to the schema.

// Instance methods operate on an instance (a Mongoose document) of the Subscriber model and are defined by subscriberSchema.methods
// Static methods are used for general queries that may relate to many Subscriber instances and are defined with subscriberSchema.statics

//instance methods, ex: subscriber1.get(); invoke by using lowercase Subscriber instance;
//static methods, ex: Subscriber.find() ; invoke by using capital Subscriber model;

//adding instance methods
subscriberSchema.methods.getInfo = function () {
  //getInfo can be called on a Subscriber instance to return the subscriber’s information in one line.
  return `Name: ${this.name} Email: ${this.email} Zip Code: ${this.zipCode}`;
};

subscriberSchema.methods.findLocalSubscribers = function () {
  //findLocalSubscribers works the same way but returns an array of subscribers. This instance method involves a Mongoose query that finds all subscribers with the same Zip code as the current instance.

  //this refers to the instance of Subscriber on which the method is called.
  //exec ensures that you get a promise back instead of needing to add an asynchronous callback here.
  return this.model("Subscriber").find({ zipCode: this.zipCode }).exec();
};

module.exports = mongoose.model("Subscriber", subscriberSchema);