"use strict";
//using Promises;
//
//exec() returns a promise that resolves with data or rejects with error
//.then() = resolve(), .catch() = reject(); if .catch() or promise rejected, any .then() after will not be invoked

//instantiate a subscriber model;
const Subscriber = require("../models/subscriber");

module.exports = {
  getAllSubscribers: (req, res) => {
    Subscriber.find({})
      .exec()
      .then((subscribers) => {
        subscribers.forEach((s) => console.log(s.getInfo()));
        res.render("subscribers", {
          subscribers: subscribers,
        });
      })
      .catch((error) => {
        console.log(error.message);
        return [];
      })
      .then(() => {
        console.log("promise complete");
      });
  },
  getSubscriptionPage: (req, res) => {
    res.render("contact");
  },
  saveSubscriber: (req, res) => {
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
  },
};
