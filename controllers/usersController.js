"use strict";

const User = require("../models/user"),
  getUserParams = (body) => {
    return {
      name: {
        first: body.first,
        last: body.last,
      },
      email: body.email,
      password: body.password,
      zipCode: body.zipCode,
    };
  };

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
  login: (req, res) => {
    res.render("users/login");
  },
  authenticate: (req, res, next) => {
    User.findOne({
      email: req.body.email,
    })
      //resolves with user object if email is found or null if not found
      .then((user) => {
        if (user) {
          user.passwordComparison(req.body.password).then((passwordsMatch) => {
            if (passwordsMatch) {
              res.locals.redirect = `/users/${user._id}`;
              //set var "success" to following message
              req.flash("success", `${user.fullName}'s logged in sucessfully!`);
              res.locals.user = user;
            } else {
              //set var "error" to following message
              req.flash(
                "error",
                "Failed to log in user account: Incorrect Password"
              );
              res.locals.redirect = "/users/login";
            }
            next();
          });
        } else {
          req.flash(
            "error",
            "Failed to log in user account: User account not found"
          );
          res.locals.redirect = "/users/login";
          next();
        }
      })
      .catch((error) => {
        console.log(`Error logging in user: ${error.message}`);
        next(error);
      });
  },
  create: (req, res, next) => {
    let userParams = getUserParams(req.body);
    //add flash messages
    User.create(userParams)
      .then((user) => {
        req.flash(
          "success",
          `${user.fullName}'s account created successfully!`
        );
        res.locals.redirect = "/users";
        res.locals.user = user;
        next();
      })
      .catch((error) => {
        console.log(`Error saving user: ${error.message}`);
        res.locals.redirect = "/users/new";
        req.flash("error", `Failed to create user account: ${error.message}`);
        next();
      });
  },
  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
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
      $set: userParams,
    })
      .then((user) => {
        res.locals.redirect = `/users/${userID}`;
        res.locals.user = user;
        next();
      })
      .catch((error) => {
        console.log(`Error updating user by ID: ${error.message}`);
        next(error);
      });
  },
  delete: (req, res, next) => {
    let userID = req.params.id;
    User.findByIdAndRemove(userID)
      .then(() => {
        res.locals.reDirect = "/users";
        next();
      })
      .catch((error) => {
        console.log(`Error deleting user by ID: ${error.message}`);
        next();
      });
  },
};
