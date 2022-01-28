var express = require("express");
var router = express.Router();
const indexController = require("../controllers/indexController");

/* GET home page. */
router.get("/", indexController.home);
/* GET login page. */
router.get("/login", indexController.login);
/* POST req login */
router.post("/login", indexController.login_post);
/* GET signup page. */
router.get("/signup", indexController.signup);
/* POST req signup */
router.post("/signup", indexController.signup_post);
/* GET logout page. */
router.get("/logout", indexController.logout);
module.exports = router;
