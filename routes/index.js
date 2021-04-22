"use strict";

const router = require("express").Router(),
  userRoutes = require("./userRoutes"),
  subscriberRoutes = require("./subscriberRoutes"),
  courseRoutes = require("./courseRoutes"),
  errorRoutes = require("./errorRoutes"),
  homeRoutes = require("./homeRoutes"),
  apiRoutes = require("./apiRoutes");

//create routes namespaces(ex: /users)
//any request for a namespace or its subroutes will use the callback file which then uses Controller
//.use is a global function; calls for every request
router.use("/users", userRoutes);
router.use("/subscribers", subscriberRoutes);
router.use("/courses", courseRoutes);
//tell router to use apiRoutes module under api namespace
router.use("/api", apiRoutes);
router.use("/", homeRoutes);
router.use("/", errorRoutes);

module.exports = router;