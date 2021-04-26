"use strict";

const Course = require("../models/course"),
  httpStatus = require("http-status-codes"),
  getCourseParams = (body) => {
    return {
      title: body.title,
      description: body.description,
      maxStudents: body.maxStudents,
      cost: body.cost,
    };
  },
  User = require("../models/user");

module.exports = {
  index: (req, res, next) => {
    //find all courses documents
    Course.find()
      .then((courses) => {
        res.locals.courses = courses;
        next();
      })
      .catch((error) => {
        console.log(`Error fetching courses data: ${error.message}`);
        next(error);
      });
  },
  indexView: (req, res) => {
    //dont need to pass "courses" parameter to render() because we stored it in res.locals
    res.render("./courses/index");
  },
  new: (req, res) => {
    res.render("./courses/new");
  },
  create: (req, res, next) => {
    let newCourse = new Course({
      title: req.body.title,
      description: req.body.description,
      maxStudents: req.body.maxStudents,
      cost: req.body.cost,
    });
    Course.create(newCourse)
      .then((course) => {
        res.locals.course = course;
        res.locals.redirect = "/courses";
        next();
      })
      .catch((error) => {
        console.log(`Error saving user: ${error.message}`);
        next(error);
      });
  },
  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath != undefined) res.redirect(redirectPath);
    else next();
  },
  show: (req, res, next) => {
    let courseId = req.params.id;
    Course.findById(courseId)
      .then((course) => {
        res.locals.course = course;
        next();
      })
      .catch((error) => {
        console.log(`Error fetching course by ID: ${error.message}`);
        // next(error);
      });
  },
  showView: (req, res) => {
    res.render("./courses/show");
  },
  edit: (req, res, next) => {
    let courseId = req.params.id;
    Course.findById(courseId)
      .then((course) => {
        //another way to render without saving params to res.locals
        res.render("./courses/edit", { course: course });
      })
      .catch((error) => {
        console.log(`Error fetching course by ID: ${error.message}`);
        next(error);
      });
  },
  update: (req, res, next) => {
    let courseId = req.params.id;
    let updatedCourse = {
      title: req.body.title,
      description: req.body.description,
      maxStudents: req.body.maxStudents,
      cost: req.body.cost,
    };
    Course.findByIdAndUpdate(courseId, updatedCourse)
      .then((course) => {
        res.locals.course = course;
        res.locals.redirect = `/courses/${course._id}`;
        next();
      })
      .catch((error) => {
        console.log(`Error fetching course by ID: ${error.message}`);
        next(error);
      });
  },
  delete: (req, res, next) => {
    let courseId = req.params.id;
    Course.findByIdAndRemove(courseId)
      .then(() => {
        res.locals.redirect = "/courses";
        next();
      })
      .catch((error) => {
        console.log(`Error fetching course by ID: ${error.message}`);
        next(error);
      });
  },
  respondJSON: (req, res, next) => {
    //send a json object as a response
    res.json({
      status: httpStatus.OK,
      //res.locals is an object
      data: res.locals,
    });
  },
  errorJSON: (error, req, res, next) => {
    //send a json object as a response
    let errorObject;
    if (error) {
      errorObject = {
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      };
    } else {
      errorObject = {
        status: httpStatus.OK,
        message: "Unknown Error",
      };
    }
    res.json(errorObject);
  },
  //checking whether a user is logged in before you continue
  //If a user is logged in, use the map function on your array of courses.
  //Within this function, look at each course and check whether its _id is found in your logged-in user’s array of courses.
  //The some function returns a Boolean value to let you know if a match occurs
  //Finally, convert the course Mongoose document object to JSON so that you can append an additional property by using Object.assign
  //This property, joined, lets you know in the user interface whether the user previously joined the course
  filterUserCourses: (req, res, next) => {
    //from main.js; set as req.user using passport
    let currentUser = res.locals.currentUser;
    if (currentUser) {
      //map() creates a new array populated with the results of calling a provided function on every element in the calling array.
      let mappedCourses = res.locals.courses.map((course) => {
        //some() method tests whether at least one element in the array passes the test implemented by the provided function.
        //It returns true if, in the array, it finds an element for which the provided function returns true; otherwise it returns false.
        //It doesn't modify the array.
        let userJoined = currentUser.courses.some((userCourse) => {
          return userCourse.equals(course._id);
        });
        //joined property is NOT saved in database
        return Object.assign(course.toObject(), { joined: userJoined });
      });
      //res.locals is an object; we are appending a subobject "courses" inside it.
      res.locals.courses = mappedCourses;
      next();
    } else {
      next();
    }
  },
  join: (req, res, next) => {
    //req.params is an object
    //req.params.id is from ":id" from a route like /courses/:id/join
    let courseId = req.params.id,
      //req.user is from main.js using passport authentication/session
      currentUser = req.user;
    if (currentUser) {
      User.findByIdAndUpdate(currentUser, {
        //User model have an array of Course model IDs called courses
        //add a courseId to courses array
        $addToSet: {
          courses: courseId,
        },
      })
        .then(() => {
          //appending success property to res.locals object
          res.locals.success = true;
          next();
        })
        .catch((error) => {
          next(error);
        });
    } else {
      //if user not logged in/session not found
      next(new Error("User must log in"));
    }
  },
};
