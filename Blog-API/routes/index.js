var express = require("express");
var router = express.Router();

const blogpost_controller = require("../controllers/blogpostcontroller");

const passport = require("../appPassport");

router.get(
  "/blogposts/:id",
  passport.authenticate("jwt", { session: false }),
  blogpost_controller.list_blogposts
);

router.get(
  "/blogposts/published/:id",
  passport.authenticate("jwt", { session: false }),
  blogpost_controller.list_blogposts_published
);

router.get(
  "/blogpost/:id",
  passport.authenticate("jwt", { session: false }),
  blogpost_controller.get_blogpost
);

router.post(
  "/blogpost",
  passport.authenticate("jwt", { session: false }),
  blogpost_controller.post_blogpost
);

router.put(
  "/blogpost/:id",
  passport.authenticate("jwt", { session: false }),
  blogpost_controller.put_blogpost
);

router.put(
  "/blogpost/publish/:id",
  passport.authenticate("jwt", { session: false }),
  blogpost_controller.put_blogpost_publish
);

router.delete(
  "/blogpost/:id",
  passport.authenticate("jwt", { session: false }),
  blogpost_controller.delete_blogpost
);

router.post(
  "/comment",
  passport.authenticate("jwt", { session: false }),
  blogpost_controller.post_comment
);

router.delete(
  "/comment/:id",
  passport.authenticate("jwt", { session: false }),
  blogpost_controller.delete_comment
);

router.put(
  "/comment/:id",
  passport.authenticate("jwt", { session: false }),
  blogpost_controller.put_comment
);

router.delete(
  "/comments/:id",
  passport.authenticate("jwt", { session: false }),
  blogpost_controller.delete_comments
);

module.exports = router;
