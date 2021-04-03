//for testing
const mongoose = require("mongoose"),
  Subscriber = require("./models/subscriber"),
  Course = require("./models/course"),
  User = require("./models/user");

mongoose.connect("mongodb://localhost:27017/recipe_db", {
  useNewUrlParser: true,
});

mongoose.Promise = global.Promise;
var testCourse, testUser, testSubscriber;
//remove all documents from Subscriber collection
Subscriber.remove({})
  .then((items) => {
    console.log(`Removed ${items.n} records!`);
  })
  .then(() => {
    return Course.remove({});
  })
  .then((items) => {
    console.log(`Removed ${items.n} records!`);
  })
  .then(() => {
    return User.remove({});
  })
  .then((items) => {
    console.log(`Removed ${items.n} records!`);
  })
  .then(() => {
    return Subscriber.create({
      name: "Jon",
      email: "jon@jonwexler.com",
      zipCode: 12345,
    });
  })
  .then((subscriber) => {
    console.log(`Created Subscriber: ${subscriber.getInfo()}`);
  })
  .then(() => {
    return Subscriber.findOne({ name: "Jon" });
  })
  .then((subscriber) => {
    testSubscriber = subscriber;
    console.log(`Found one subscriber: ${subscriber.getInfo()}`);
  })
  .then(() => {
    return Course.create({
      title: "Tomato Land",
      description: "Locally farmed tomatoes only",
      zipCode: 12345,
      items: ["cherry", "heirloom"],
    });
  })
  .then((course) => {
    console.log(`Created course: ${course.title}`);
    testCourse = course;
    console.log("test:" + testCourse);
  })
  .then(() => {
    testSubscriber.courses.push(testCourse);
    testSubscriber.save();
  })
  .then(() => {
    Subscriber.populate(testSubscriber, "courses");
  })
  .then(() => {
    console.log(testSubscriber);
  })
  .then(() => {
    return Subscriber.find({
      courses: mongoose.Types.ObjectId(testCourse._id),
    });
  })
  .then(() => {
    return User.create({
      name: {
        first: "Jon",
        last: "Wexler",
      },
      email: "jon@jonwexler.com",
      password: "pass123",
    });
  })
  .then((user) => {
    user.subscribedAccount = testSubscriber;
    user.save().then((user) => {
      console.log("User info:" + user);
    });
  })
  .catch((error) => {
    console.log(error.message);
  });
