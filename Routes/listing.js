const express = require("express");
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner,validateListing} = require("../middleware.js");
const listingController = require("../controller/listings.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});


router.route("/")
// index Route
.get(wrapAsync(listingController.index))
//Create Route
.post(isLoggedIn,
      validateListing,
      upload.single("listing[image]"),
      wrapAsync(listingController.createListings)
 );

 //New Route
router.get("/new",
  isLoggedIn ,
  listingController.renderNewForm);

 router.route("/:id")
 // Show Route
 .get( wrapAsync(listingController.showListings ))
  //Update Route
 .put(isLoggedIn,
      isOwner,
      upload.single("listing[image]"),
      validateListing,
      wrapAsync(listingController.updateListings))
  //Delete Route
  .delete(isLoggedIn,
          isOwner,
          wrapAsync(listingController.deleteListings));
      
//Edit Route
router.get("/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync( listingController.editListings));

module.exports = router;