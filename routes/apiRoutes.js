//Instantiate express router
const router = require("express").Router(),
  coursesController = require("../controllers/coursesController");
//Namespace for /api
router.get(
  "/courses",
  coursesController.index,
  coursesController.filterUserCourses,
  coursesController.respondJSON
);
router.get(
  "/courses/:id/join",
  coursesController.join,
  coursesController.respondJSON
);
router.use(coursesController.errorJSON);

//add router to module.exports
module.exports = router;
