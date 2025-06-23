const express = require("express");
const router = express.Router();

// import controller
const winesController = require("../controllers/winesController");

// routes
router.get("/", winesController.index);

router.get("/slug/:slug", winesController.showBySlug);

router.get("/bestseller", winesController.getBestSellers);

router.get("/premiumvintage", winesController.premiumVintage);

router.get("/getcategories", winesController.getCategories);
router.get("/getdenominations", winesController.getDenominations);
router.get("/getregions", winesController.getRegions);

router.get("/:id", winesController.show);

router.get("/category/:id", winesController.getWineFromCategory);

module.exports = router;
