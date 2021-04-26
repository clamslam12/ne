//defines all namespaces
//glues all routes together
const router = require("express").Router(),
  userRoutes = require("./userRoutes"),
  subscriberRoutes = require("./subscriberRoutes"),
  courseRoutes = require("./courseRoutes"),
  homeRoutes = require("./homeRoutes"),
  errorRoutes = require("./errorRoutes");

router.use("/users", userRoutes);
router.use("/subscribers", subscriberRoutes);
router.use("/courses", courseRoutes);
//for all routes
router.use("/", homeRoutes);
router.use("/", errorRoutes);

//add router to module.exports
module.exports = router;
