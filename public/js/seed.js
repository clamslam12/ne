"use strict";
//Initializing your Database with test data

// This code makes a connection to your local database and loops through an array of subscribers to create.

// First, clear the existing subscriber database with deleteMany.

// Then, loop through contacts array and create and save a corresponding Subscriber object for every contact in the array.

// Finally, Promise.all waits for all new subscriber documents to be created before printing log messages.

const mongoose = require("mongoose"),
  Subscriber = require("../../models/subscriber");

mongoose.connect("mongodb://localhost:27017/recipe_db", {
  useNewUrlParser: true,
});
mongoose.connection;

var contacts = [
  {
    name: "Jon Wexler",
    email: "jon@jonwexler.com",
    zipCode: 10016,
  },
  {
    name: "Chef Eggplant",
    email: "eggplant@recipeapp.com",
    zipCode: 20331,
  },
  {
    name: "Professor Souffle",
    email: "souffle@recipeapp.com",
    zipCode: 19103,
  },
];

Subscriber.deleteMany() //deletes all documents in a collection
  .exec()
  .then(() => {
    console.log("Subscriber data is empty");
  });

var commands = [];

contacts.forEach((c) => {
  commands.push(
    Subscriber.create({
      name: c.name,
      email: c.email,
      zipCode: c.zipCode,
    })
  );
});

//waits for all promises in the array to be resolved; takes an array of promises as an argument
Promise.all(commands)
  .then((r) => {
    console.log(JSON.stringify(r)); //prints array of objects
    mongoose.connection.close();
  })
  .catch((error) => {
    console.log(`Error: ${error}`);
  });
  //
