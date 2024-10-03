var express = require("express");
var router = express.Router();

const passport = require("../appPassport");

const user_controller = require("../controllers/usercontroller");

router.post("/login", user_controller.login_user);

router.get("/logout", user_controller.logout_user);

router.get(
  "/authors",
  passport.authenticate("jwt", { session: false }),
  user_controller.list_authors
);

router.get("/user/:id", user_controller.get_user);

router.post("/user", user_controller.post_user);

router.post("/user/author", user_controller.post_author);

router.put("/user/:id", user_controller.put_user);

router.delete("/user/:id", user_controller.delete_user);

module.exports = router;
