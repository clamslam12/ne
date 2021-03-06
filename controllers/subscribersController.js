"use strict";
//using Promises; 
//
//exec() returns a promise that resolves with data or rejects with error
//.then() = resolve(), .catch() = reject(); if .catch() or promise rejected, any .then() after will not be invoked

const Subscriber = require("../models/subscriber");

exports.getAllSubscribers = (req, res) => {
  //find() with empty object returns all documents in a collection
  Subscriber.find({})
    .exec()
    .then((subscribers) => {
      res.render("subscribers", { subscribers: subscribers });
    })
    .catch((error) => {
      console.log(error.message);
    })
    .then(() => {
      console.log("promise chain complete");
    });
};

//Because this form will display when contact.ejs is rendered,
//create a route to render this view when GET requests are made to the /contact path from the subscribers controller.
//app.get("/contact", subscribersController.getSubscriptionPage) in main.js
exports.getSubscriptionPage = (req, res) => {
  res.render("contact");
};

//save data to database
//app.post("/subscribe", subscribersController.saveSubscriber) in main.js
//save() returns a promise that resolves with result or rejects with error
exports.saveSubscriber = (req, res) => {
  let newSubscriber = new Subscriber({
    name: req.body.name,
    email: req.body.email,
    zipCode: req.body.zipCode,
  });
  newSubscriber
    .save()
    .then((result) => {
      res.render("thanks");
    })
    .catch((error) => {
      if (error) res.send(error);
    });
};
