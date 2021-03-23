"use strict";
// This code defines a global method getAllSubscribers that retrieves the list of all subscribers from database.

// If an error occurs while reading from the database, we send it to the next middleware function

// Otherwise, we set the data that comes back from MongoDB to the request object. Then this object can be accessed by the next function in the middleware chain.
const Subscriber = require("../models/subscriber");
exports.getAllSubscribers = (req, res, next) => {
  //find with empty object returns all documents in a collection
  Subscriber.find({}, (error, subscribers) => {
    if (error) next(error);
    req.data = subscribers;
    next();
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
exports.saveSubscriber = (req, res) => {
  let newSubscriber = new Subscriber({
    name: req.body.name,
    email: req.body.email,
    zipCode: req.body.zipCode,
  });
  newSubscriber.save((error, result) => {
    if (error) res.send(error);
    res.render("thanks");
  });
};
