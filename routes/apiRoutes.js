"use strict";

const router = require("express").Router(),
  coursesController = require("../controllers/coursesController");

//starting route /api
router.get("/courses", coursesController.index, coursesController.respondJSON);
router.use(coursesController.errorJSON);

module.exports = router;
