const express = require("express"),
  app = express(),
  router = express.Router(),
  methodOverride = require("method-override"),
  layouts = require("express-ejs-layouts"),
  errorController = require("./controllers/errorController"),
  subscribersController = require("./controllers/subscribersController"),
  homeController = require("./controllers/homeController"),
  coursesController = require("./controllers/coursesController"),
  usersController = require("./controllers/usersController"),
  mongoose = require("mongoose");

//using Promises with Mongoose
mongoose.Promise = global.Promise;
//initiate connection
mongoose.connect("mongodb://localhost:27017/confetti_cuisine", {
  useNewUrlParser: true,
});
mongoose.set("useCreateIndex", true);
//connect to db
const db = mongoose.connection;
//invokes callback once upon receiving an "open" event from the database
db.once("open", () => {
  console.log("Successfully connected to MongoDB using Mongoose!");
});

// //2 ways of creating documents(rows) in a collection(table)
// ///both ways are async
// var subscriber1 = new Subscriber({
//   name: "Minh Durbin",
//   email: "minhdurbin@mail.com",
// });
// subscriber1.save((error, savedDocument) => {
//   if (error) console.log(error);
//   console.log("inserted using save method", savedDocument);
// });
// //

// Subscriber.create(
//   {
//     name: "Jon Wexler",
//     email: "jon@wexler.com",
//   },
//   (error, savedDocument) => {
//     if (error) console.log(error);
//     console.log("inserted using create method", savedDocument);
//   }
// );
// //Query documents
// //
// var myQuery = Subscriber.find({
//   name: "Jon Wexler",
// }).where("email", /wexler/); //where email contains "wexler"

// myQuery.exec((error, data) => {
//   if (data) console.log(data); //prints an array of objects; if no results for query, prints empty array
// });
//
//Middlewares; middlewares are invoked in the order they are defined
//
//global middlewares
app.set("port", process.env.PORT || 3000);
app.set("view engine", "ejs");
app.use(
  express.urlencoded({
    extended: false,
  })
);
//handle all routes that starts with /
app.use("/", router);

router.use(methodOverride("_method", { methods: ["POST", "GET"] }));
router.use(layouts);
router.use(express.static("public"));
router.use(express.json());
//logs request paths
router.use(homeController.logRequestPaths);

//Routers and their middlewares (their callback functions)
router.get("/", homeController.index);

//subscribers routers/controllers
router.get(
  "/subscribers",
  subscribersController.index,
  subscribersController.indexView
);
router.get("/subscribers/new", subscribersController.new);
router.post(
  "/subscribers/create",
  subscribersController.create,
  subscribersController.redirectView
);
router.get(
  "/subscribers/:id",
  subscribersController.show,
  subscribersController.showView
);
router.get("/subscribers/:id/edit", subscribersController.edit);
router.put(
  "/subscribers/:id/update",
  subscribersController.update,
  subscribersController.redirectView
);
router.delete(
  "/subscribers/:id/delete",
  subscribersController.delete,
  subscribersController.redirectView
);

//courses routers/controllers
router.get("/courses", coursesController.index, coursesController.indexView);
router.get("/courses/new", coursesController.new);
router.post(
  "/courses/create",
  coursesController.create,
  coursesController.redirectView
);
router.get("/courses/:id", coursesController.show, coursesController.showView);
router.get("/courses/:id/edit", coursesController.edit);
router.put(
  "/courses/:id/update",
  coursesController.update,
  coursesController.redirectView
);
router.delete(
  "/courses/:id/delete",
  coursesController.delete,
  coursesController.redirectView
);

//users routers/controllers
router.get("/users", usersController.index, usersController.indexView);
router.get("/users/new", usersController.new);
router.post(
  "/users/create",
  usersController.create,
  usersController.redirectView
);
router.get("/users/:id", usersController.show, usersController.showView);
router.get("/users/:id/edit", usersController.edit);
router.put(
  "/users/:id/update",
  usersController.update,
  usersController.redirectView
);
router.delete(
  "/users/:id/delete",
  usersController.delete,
  usersController.redirectView
);

//error handling middlewares
router.use(errorController.pageNotFoundError);
router.use(errorController.internalServerError);


app.listen(app.get("port"), () => {
  console.log(`Server is running on port ${app.get("port")}`);
});
