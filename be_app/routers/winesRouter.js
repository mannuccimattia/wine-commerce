const express = require("express");
const router = express.Router();

// import controller
const winesController = require("../controllers/winesController");

// routes
router.get("/", winesController.index);

router.get("/bestseller", winesController.getBestSellers);

router.get("/premiumvintage", winesController.premiumVintage);

router.get("/getcategories", winesController.getCategories);

router.get("/:id", winesController.show);

router.get("/category/:id", winesController.getWineFromCategory);

module.exports = router;
