"use strict";

const usersController = require("../controllers/usersController");

const router = require("express").Router(),
  coursesController = require("../controllers/coursesController");
//parent route is /api
router.post("/login", usersController.apiAuthenticate);
//before all other routes because we want to verify their JWT; after post to /login because we are creating a JWT
router.use(usersController.verifyJWT);
router.get(
  "/courses/:id/join",
  coursesController.join,
  coursesController.respondJSON
);
router.get(
  "/courses",
  coursesController.index,
  coursesController.filterUserCourses,
  coursesController.respondJSON
);

router.use(coursesController.errorJSON);

module.exports = router;
