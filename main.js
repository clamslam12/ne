"use strict";

const express = require("express"),
  app = express(),
  errorController = require("./controllers/errorController"),
  homeController = require("./controllers/homeController"),
  subscribersController = require("./controllers/subscribersController"),
  usersController = require("./controllers/usersController"),
  layouts = require("express-ejs-layouts"),
  mongoose = require("mongoose"),
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

var myQuery = Subscriber.findOne({
  name: "Jon Wexler",
}).where("email", /wexler/);

myQuery.exec((error, data) => {
  if (data) console.log(data.name);
});

app.set("port", process.env.PORT || 3000);
app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(layouts);
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(express.json());
app.use(homeController.logRequestPaths);

app.get("/users", usersController.index, usersController.indexView); //indexView action is added the middleware function that follows the index action in your route
app.get("/name", homeController.respondWithName);
app.get("/items/:vegetable", homeController.sendReqParam);

app.get(
  "/subscribers",
  subscribersController.getAllSubscribers,
  (req, res, next) => {
    res.render("subscribers", { subscribers: req.data });
  }
);

app.get("/", homeController.index);
app.get("/courses", homeController.showCourses);

app.get("/contact", subscribersController.getSubscriptionPage);
app.post("/subscribe", subscribersController.saveSubscriber);

app.use(errorController.logErrors);
app.use(errorController.respondNoResourceFound);
app.use(errorController.respondInternalError);

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
