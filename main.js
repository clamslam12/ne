const express = require("express"),
  app = express(),
  router = require("./routes/index"),
  methodOverride = require("method-override"),
  layouts = require("express-ejs-layouts"),
  errorController = require("./controllers/errorController"),
  subscribersController = require("./controllers/subscribersController"),
  homeController = require("./controllers/homeController"),
  coursesController = require("./controllers/coursesController"),
  usersController = require("./controllers/usersController"),
  mongoose = require("mongoose"),
  passport = require("passport"),
  cookieParser = require("cookie-parser"),
  expressSession = require("express-session"),
  expressValidator = require("express-validator"),
  connectFlash = require("connect-flash"),
  User = require("./models/user");
//
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

router.use(methodOverride("_method", { methods: ["POST", "GET"] }));
router.use(layouts);
router.use(express.static("public"));
router.use(express.json());

//use sessions through cookies setup
router.use(cookieParser("my_passcode"));
router.use(
  expressSession({
    secret: "my_passcode",
    cookie: {
      maxAge: 360000,
    },
    resave: false,
    saveUninitialized: false,
  })
);
//express validator setup
router.use(expressValidator());

//conect-flash setup
router.use(connectFlash());

//passport setup
router.use(passport.initialize());
router.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//save flash messages from req.flash(), set loggedIn flag/var, and set current user
router.use((req, res, next) => {
  res.locals.flashMessages = req.flash(); //key/value pairs
  res.locals.loggedIn = req.isAuthenticated();
  res.locals.currentUser = req.user;
  next();
});

//handle all routes that starts with /
app.use("/", router);

app.listen(app.get("port"), () => {
  console.log(`Server is running on port ${app.get("port")}`);
});
