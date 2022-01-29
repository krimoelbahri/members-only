var express = require("express");
var router = express.Router();
const indexController = require("../controllers/indexController");

/* GET home page. */
router.get("/", indexController.home);
/* GET admin page. */
router.get("/admin", indexController.admin);
/* POST a Message */
router.post("/admin", indexController.admin_post);

/* GET member page. */
router.get("/member", indexController.member);
/* POST a Message */
router.post("/member", indexController.member_post);

/* GET message page. */
router.get("/message", indexController.addMessage);
/* POST a Message */
router.post("/message", indexController.addMessage_post);

/* get req delete */
router.get("/delete/:id", indexController.delete);

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
