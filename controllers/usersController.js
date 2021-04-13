"use strict";

const passport = require("passport");

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
  authenticate: passport.authenticate("local", {
    failureRedirect: "/users/login",
    failureFlash: "Failed to login",
    successRedirect: "/",
    successFlash: "Successfully logged in!",
  }),
  create: (req, res, next) => {
    if (req.skip) return next(); //if previous validation middleware fail, then go to next middleware and dont create user

    //using Passport registration in user creation
    let newUser = new User(getUserParams(req.body));
    //register method comes with Passport
    User.register(newUser, req.body.password, (error, user) => {
      //add flash messages
      if (user) {
        req.flash(
          "success",
          `${user.fullName}'s account created successfully!`
        );
        res.locals.redirect = "/users";
        next();
      } else {
        req.flash(
          "error",
          `Failed to create user account because: ${error.message}`
        );
        res.locals.redirect = "/users/new";
        next();
      }
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
    if (req.skip) return next(); //if previous validation middleware fail, then go to next middleware and dont create user
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
  //using validation middleware instead of validation from view and model(User.find)
  //attackers can bypass view(front-end) validation using cURL. So we need both front and server validation
  validate: (req, res, next) => {
    //req functions comes from express-validator
    req
      .sanitizeBody("email")
      .normalizeEmail({
        all_lowercase: true,
      })
      .trim();
    req.check("email", "Email is invalid").isEmail();
    req
      .check("zipCode", "Zip code is invalid")
      .notEmpty()
      .isInt()
      .isLength({
        min: 5,
        max: 5,
      })
      .equals(req.body.zipCode); //checks if zipCode follows the template from html
    req.check("password", "Password cannot be empty").notEmpty();

    req.getValidationResult().then((error) => {
      if (!error.isEmpty()) {
        let messages = error.array().map((e) => e.msg);
        req.skip = true; //req custom property/flag
        req.flash("error", messages.join(" and "));
        res.locals.redirect = "/users/new";
        next();
      } else {
        next();
      }
    });
  },
};
