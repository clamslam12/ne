"use strict";

const User = require("../models/user");

module.exports = {
  index: (req, res, next) => {
    User.find({})
      .then((users) => {
        //res.locals = a unique object on the response that lets you define a variable to which you’ll have access in your view
        //By assigning the results to res.locals.users, you won’t need to change your view; the variable name users matches locally in the view
        //makes "users" variable available locally to whatever res is rendering
        console.log(users);
        res.locals.users = users;
        next();
      })
      .catch((error) => {
        console.log(`Error fetching users: ${error.message}`);
        next(error);
      });
  },
  indexView: (req, res) => {
    res.render("users/index");
  },
};
