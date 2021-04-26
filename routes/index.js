//defines all namespaces
//glues all routes together
const router = require("express").Router(),
  userRoutes = require("./userRoutes"),
  subscriberRoutes = require("./subscriberRoutes"),
  courseRoutes = require("./courseRoutes"),
  homeRoutes = require("./homeRoutes"),
  errorRoutes = require("./errorRoutes"),
  apiRoutes = require("./apiRoutes");
//for specific routes
router.use("/users", userRoutes);
router.use("/subscribers", subscriberRoutes);
router.use("/courses", courseRoutes);
router.use("/api", apiRoutes);
//for all routes
//must be defined last because if a specific route is requested, that request will go through the root route "/" first. 
//This will invoke the homeRoutes namespace, which will result in an error since there doesn't exists controllers for that specific route from homeRoutes
router.use("/", homeRoutes);
router.use("/", errorRoutes);

//add router to module.exports
module.exports = router;
