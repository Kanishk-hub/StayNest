const express = require("express");
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapAsync.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controller/review.js");

  //Reviews
//Post Review Route
router.post("/", 
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.postReview));
  
  //Delete Review Route
router.delete("/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync( reviewController.deleteReview));

  module.exports = router;