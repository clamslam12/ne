//Instantiate express router
const router = require("express").Router(),
  homeController = require("../controllers/homeController");
//Namespace for /
router.get("/", homeController.index);

//add router to module.exports
module.exports = router;
