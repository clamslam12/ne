"use strict";

const express = require("express"),
  app = express(),
  //creates a Router object that offers its own middleware and routing alongside the Express.js app object
  router = express.Router(),
  layouts = require("express-ejs-layouts"),
  mongoose = require("mongoose"),
  methodOverride = require("method-override"),
  errorController = require("./controllers/errorController"),
  homeController = require("./controllers/homeController"),
  subscribersController = require("./controllers/subscribersController"),
  usersController = require("./controllers/usersController"),
  Subscriber = require("./models/subscriber"),
  Course = require("./models/course"),
  //express-session module to pass messages between your application and the client
  //These messages persist on the user’s browser but are ultimately stored in the server
  //express-session allows you to store your messages in a few ways on the user’s browser
  //Cookies are one form of session storage, so you need the cookie-parser package to indicate that you want to use cookies
  //Cookies are small files of data sent from the server to the user’s browser, containing information about the interaction between the user and the application
  //
  //Why we need cookies?
  //HTTP is a stateless protocol. Every request is processed individually and independently.
  //Because requests are independent of one another, if one request to create a new user fails and you’re redirected to the home page, that redirect is another request, and nothing is sent in the response to the user to let them know that their attempt to create an account failed.
  //Cookies are used to create a sense of State between multiple HTTP requests that are part of the same session
  expressSession = require("express-session"),
  cookieParser = require("cookie-parser"),
  connectFlash = require("connect-flash"),
  //validation middleware
  //validate: check whether incoming data follows a certain format
  //sanitize: methods that modify that data to remove unwanted characters.
  expressValidator = require("express-validator"),
  //passport
  passport = require("passport"),
  User = require("./models/user");

//passport serializing
//Serialization is the process of converting data from some data structure to a compact readable format.
//Passport.js performs the serialization process and encrypts your user’s data so that it can be stored as part of the session cookie on the client’s browser.
//Because this cookie contains information about the user, it lets your application server know, the next time a request occurs, that this user has logged in before, which is your way of validating some-one’s state in your application
passport.use(User.createStrategy()); //use the default local login strategy
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

mongoose.Promise = global.Promise;

mongoose.connect("mongodb://localhost:27017/recipe_db", {
  useNewUrlParser: true,
});
mongoose.set("useCreateIndex", true);
const db = mongoose.connection;

db.once("open", () => {
  console.log("Successfully connected to MongoDB using Mongoose!");
});

// var myQuery = Subscriber.findOne({
//   name: "Jon Wexler",
// }).where("email", /wexler/);

// myQuery.exec((error, data) => {
//   if (data) console.log(data.name);
// });

// app.use("/", router);
app.set("port", process.env.PORT || 3000);
app.set("view engine", "ejs");

//tell Express.js app to use express-validator
router.use(expressValidator());

///tell Express.js application to use cookie-parser as middleware and to use some secret passcode you choose to encrypt data in cookies
router.use(cookieParser("secret_passcode"));
//have your application use sessions by telling express-session to use cookie-parser as its storage method and to expire cookies after about an hour.
router.use(
  expressSession({
    secret: "secret_passcode",
    cookie: {
      maxAge: 360000,
    },
    //don’t want to update existing session data on the server if nothing has changed in the existing session by setting resave to false
    resave: false,
    //don’t want to send a cookie to the user if no messages are added to the session by setting saveUninitialized to false
    saveUninitialized: false,
  })
);
//passport
router.use(passport.initialize());
router.use(passport.session()); //tells passport to use whatever sessions you've already set up with your app; comes after express-session
//have the application use connect-flash as middleware
router.use(connectFlash());
//A flash message is no different from a local variable being made available to the view.
//need to set up another middleware configuration for express to treat your connectFlash messages like a local variable on the response
//transfer the messages from request obj to the response
router.use((req, res, next) => {
  res.locals.flashMessages = req.flash(); //key/value pairs
  next();
});
router.use(
  methodOverride("_method", {
    methods: ["POST", "GET"],
  })
);
router.use(express.static("public"));
router.use(layouts);
router.use(
  express.urlencoded({
    extended: false,
  })
);
router.use(express.json());

router.use(homeController.logRequestPaths);

router.get("/", homeController.index);
//Order matters: if you have two routes /users/:id and /users/login, and users/login route comes first, Express.js will match that route before checking the routes that handle parameters
//Otherwise, Express.js will treat a request to the user's show page where login is the :id
router.get("/users/login", usersController.login);
router.post(
  "/users/login",
  usersController.authenticate,
  usersController.redirectView
);
router.get("/users", usersController.index, usersController.indexView); //indexView action is added the middleware function that follows the index action in your route
router.get("/users/new", usersController.new);
router.post(
  "/users/create",
  //validate middleware
  usersController.validate,
  usersController.create,
  usersController.redirectView
);

//Different ways to pass data from client to server
//1) pass it with url query string, ex: /?name=minh&gender=male
//2) put data in body of request, ex: Post method in form, value of inputs are retrieved from "name" attributes; req.body.zipCode
//3) put data in url params(req.params), ex: /users/:id
//
router.get("/users/:id", usersController.show, usersController.showView);
router.get("/users/:id/edit", usersController.edit);
router.put(
  "/users/:id/update",
  usersController.validate,
  usersController.update,
  usersController.redirectView
);
router.delete(
  "/users/:id/delete",
  usersController.delete,
  usersController.redirectView
);
router.get("/name", homeController.respondWithName);
router.get("/items/:vegetable", homeController.sendReqParam);

router.get(
  "/subscribers",
  subscribersController.getAllSubscribers,
  (req, res, next) => {
    res.render("subscribers", { subscribers: req.data });
  }
);
router.get("/courses", homeController.showCourses);

router.get("/contact", subscribersController.getSubscriptionPage);
router.post("/subscribe", subscribersController.saveSubscriber);

router.use(errorController.logErrors);
router.use(errorController.respondNoResourceFound);
router.use(errorController.respondInternalError);

//An instance of a model is called a document.
//Creating an instance and save to database
// Course.create({
//   title: "Tomato Land",
//   description: "Locally farmed tomatoes only",
//   zipCode: 12345,
//   items: ["cherry", "heirlooms"],
// }).then((course) => {
//   console.log(course);
//   Subscriber.findOne({}).then((subscriber) => {
//     subscriber.courses.push(course._id); //Alternatively, you can push Course model instance,course1, into subscriber1.courses, like -> subscriber1.courses.push(course1)
//     subscriber.save();
//     //takes all the courses associated with the subscriber object and replaces their ObjectIds with the full Course document in the subscriber’s courses array.
//     Subscriber.populate(subscriber, "courses").then((subscriber) => {
//       console.log(subscriber);
//     });
//   });
// });

//find subscribers that are registered for a specific course w/ Subscriber.find({courses: mongoose.Types.ObjectId("5986b8aad7f31c479a983b42")}).
// Course.findOne({ title: "Tomato Land" })
//   .then((course) => {
//     return Subscriber.find({ courses: mongoose.Types.ObjectId(course._id) });
//   })
//   .then((subscribers) => {
//     subscribers.forEach((s) => {
//       console.log(s);
//     });
//   });

app.use("/", router);
app.listen(app.get("port"), () => {
  console.log(`Server running at http://localhost:${app.get("port")}`);
});
