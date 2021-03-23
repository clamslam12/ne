const express = require("express"),
  app = express(),
  homeController = require("./controllers/homeController"),
  layouts = require("express-ejs-layouts"),
  errorController = require("./controllers/errorController");
//Using Mongoose with MongoDB
//
const mongoose = require("mongoose"),
  Subscriber = require("./models/subscriber");
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
  if (data) console.log(data);//prints an array of objects 
});

//   //connecting to MongoDB
//
//  const MongoDB = require("mongodb").MongoClient, //instantiate MongoClient object
//   dbURl = "mongodb://localhost:27017", //reference to db URL
//   dbName = "recipe_db"; //reference the database name

// //connect to dbURL with a callback function
// MongoDB.connect(dbURl, (error, client) => {
//   if (error) {
//     throw error;
//   }
//   //instantiate dbName object
//   let db = client.db(dbName);
//   //select a collection(table), retrieve all documents, and convert to array of documents
//   db.collection("contacts")
//     .find()
//     .toArray((error, data) => {
//       if (error) {
//         throw error;
//       }
//       console.log(data);
//     });
//   //insert a document to a collection with a callback
//   db.collection("contacts").insertOne(
//     {
//       name: "Freddie Mercury",
//       email: "fred@queen.com",
//     },
//     (error, db) => {
//       if (error) throw error;
//       console.log(db);
//     }
//   );
// });

app.set("port", process.env.PORT || 3000);
app.set("view engine", "ejs");

//middlewares
app.use(layouts);
app.use(express.static("public"));
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(express.json());

//Routers and their middlewares (their callback functions)
app.get("/", homeController.showIndex);
app.get("/courses", homeController.showCourses);
app.get("/contact", homeController.showSignUp);
app.post("/contact", homeController.postedSignUpForm);

//error handling
app.use(errorController.pageNotFoundError);
app.use(errorController.internalServerError);

app.listen(app.get("port"), () => {
  console.log(`Server is running on port ${app.get("port")}`);
});
