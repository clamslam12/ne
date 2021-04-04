"use strict";

const express = require("express"),
  app = express(),
  router = express.Router(),
  layouts = require("express-ejs-layouts"),
  mongoose = require("mongoose"),
  errorController = require("./controllers/errorController"),
  homeController = require("./controllers/homeController"),
  subscribersController = require("./controllers/subscribersController"),
  usersController = require("./controllers/usersController"),
  Subscriber = require("./models/subscriber"),
  Course = require("./models/course");

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
app.use("/", router);
app.set("port", process.env.PORT || 3000);
app.set("view engine", "ejs");

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

router.get("/users", usersController.index, usersController.indexView); //indexView action is added the middleware function that follows the index action in your route
router.get("/users/new", usersController.new);
router.post(
  "/users/create",
  usersController.create,
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

app.listen(app.get("port"), () => {
  console.log(`Server running at http://localhost:${app.get("port")}`);
});
