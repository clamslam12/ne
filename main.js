const express = require("express"),
  app = express(),
  homeController = require("./controllers/homeController"),
  layouts = require("express-ejs-layouts"),
  errorController = require("./controllers/errorController"),
  subscribersController = require("./controllers/subscribersController");
//Using Mongoose with MongoDB
//
const mongoose = require("mongoose"),
  Subscriber = require("./models/subscriber");
//using Promises with Mongoose
mongoose.Promise = global.Promise;
//initiate connection
mongoose.connect("mongodb://localhost:27017/recipe_db", {
  useNewUrlParser: true,
});
mongoose.set("useCreateIndex", true);
//connect to db
const db = mongoose.connection;
//invokes callback once upon receiving an "open" event from the database
db.once("open", () => {
  console.log("Successfully connected to MongoDB using Mongoose!");
});

//2 ways of creating documents(rows) in a collection(table)
///both ways are async
var subscriber1 = new Subscriber({
  name: "Minh Durbin",
  email: "minhdurbin@mail.com",
});
subscriber1.save((error, savedDocument) => {
  if (error) console.log(error);
  console.log("inserted using save method", savedDocument);
});
//

Subscriber.create(
  {
    name: "Jon Wexler",
    email: "jon@wexler.com",
  },
  (error, savedDocument) => {
    if (error) console.log(error);
    console.log("inserted using create method", savedDocument);
  }
);
//Query documents
//
var myQuery = Subscriber.find({
  name: "Jon Wexler",
}).where("email", /wexler/); //where email contains "wexler"

myQuery.exec((error, data) => {
  if (data) console.log(data); //prints an array of objects
});

app.set("port", process.env.PORT || 3000);
app.set("view engine", "ejs");

//Middlewares; middlewares are invoked in the order they are defined
app.use(layouts);
app.use(express.static("public"));
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(express.json());
app.use(homeController.logRequestPaths);

//Routers and their middlewares (their callback functions)
//
//runs subscribersController.getAllSubscribers middleware first, then invokes the callback middleware
app.get("/subscribers", subscribersController.getAllSubscribers);
app.get("/", homeController.showIndex);
app.get("/courses", homeController.showCourses);
app.get("/contact", subscribersController.getSubscriptionPage);
app.post("/contact", homeController.postedSignUpForm);
app.post("/subscribe", subscribersController.saveSubscriber);

//error handling middlewares
app.use(errorController.pageNotFoundError);
app.use(errorController.internalServerError);

app.listen(app.get("port"), () => {
  console.log(`Server is running on port ${app.get("port")}`);
});
