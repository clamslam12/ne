//Instantiate express router
const router = require("express").Router(),
  errorController = require("../controllers/errorController");
//Namespace for / errors
router.use(errorController.pageNotFoundError);
router.use(errorController.internalServerError);

//add router to module.exports
module.exports = router;
