const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { savedRedirectUrl } = require("../middleware.js");
const userController = require("../controller/user.js");

//signup
router.route("/signup")
.get(userController.renderSignUp)
.post(wrapAsync(userController.userSignUp));

//login
router.route("/login")
.get(userController.renderLogin)
.post(savedRedirectUrl,
      passport.authenticate("local",{
        failureRedirect: "/login",
         failureFlash: true
        }),
    userController.userLogin);

//logout    
router.get("/logout",
    userController.userLogOut);

module.exports = router;