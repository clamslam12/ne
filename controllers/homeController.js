"use strict";

var courses = [
  {
    title: "Event Driven Cakes",
    cost: 50,
  },
  {
    title: "Asynchronous Artichoke",
    cost: 25,
  },
  {
    title: "Object Oriented Orange Juice",
    cost: 10,
  },
];
//export controller actions using object literal
module.exports = {
  logRequestPaths: (req, res, next) => {
    console.log(`request made to: ${req.url}`);
    next();
  },
  index: (req, res) => {
    res.render("index");
  },
  getSubscriptionPage: (req, res) => {
    res.render("contact");
  },
  showCourses: (req, res) => {
    res.render("courses", {
      offeredCourses: courses,
    });
  },
  sendReqParam: (req, res) => {
    let veg = req.params.vegetable;
    res.send(`This is the page for ${veg}`);
  },
  respondWithName: (req, res) => {
    res.render("index");
  },
};
