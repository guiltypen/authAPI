const express = require("express");

const router = express.Router();

// import controllers
const { signup, signin } = require("./userController");

// requir passport for signin
const passport = require("passport");

// signup router
router.post("/signup", signup);

// signin router
router.post(
  "/signin",
  passport.authenticate("local", { session: false }),
  signin
);

module.exports = router;
