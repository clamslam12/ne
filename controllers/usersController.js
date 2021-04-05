"use strict";

const User = require("../models/user");

module.exports = {
  index: (req, res, next) => {
    User.find({})
      .then((users) => {
        //res.locals = a unique object on the response that lets you define a variable to which you’ll have access in your view
        //By assigning the results to res.locals.users, you won’t need to change your view; the variable name users matches locally in the view
        //makes "users" variable available locally to whatever res is rendering; no need to do res.render('view', {var: value})
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
  new: (req, res) => {
    res.render("users/new");
  },
  create: (req, res, next) => {
    let newUser = new User({
      name: {
        first: req.body.first,
        last: req.body.last,
      },
      email: req.body.email,
      password: req.body.password,
      zipCode: req.body.zipCode,
    });
    User.create(newUser)
      .then((user) => {
        res.locals.reDirect = "/users";
        res.locals.user = user;
        next();
      })
      .catch((error) => {
        console.log(`Error saving user: ${error.message}`);
        next(error);
      });
  },
  redirectView: (req, res, next) => {
    let redirectPath = res.locals.reDirect;
    if (redirectPath) res.redirect(redirectPath);
    else next();
  },
  show: (req, res, next) => {
    let userID = req.params.id;
    User.findById(userID)
      .then((user) => {
        res.locals.user = user;
        next();
      })
      .catch((error) => {
        console.log(`Error fetching user by ID: ${error.message}`);
        next(error);
      });
  },
  showView: (req, res) => {
    res.render("users/show");
  },
  edit: (req, res, next) => {
    let userID = req.params.id;
    User.findById(userID)
      .then((user) => {
        res.render("users/edit", { user: user });
      })
      .catch((error) => {
        console.log(`Error fetching user by ID: ${error.message}`);
        next(error);
      });
  },
  update: (req, res, next) => {
    let userID = req.params.id;
    let userParams = {
      name: {
        first: req.body.first,
        last: req.body.last,
      },
      email: req.body.email,
      password: req.body.password,
      zipCode: req.body.zipCode,
    };
    User.findByIdAndUpdate(userID, {
        $set: userParams
    })
    .then(user=>{
        res.locals.reDirect = `/users/${userID}`;
        res.locals.user = user;
        next();
    })
    .catch(error=>{
        console.log(`Error updating user by ID: ${error.message}`);
        next(error);
    })
  },
};
