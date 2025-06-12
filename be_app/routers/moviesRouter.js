const express = require("express");
const router = express.Router();

// import controller
const moviesController = require("../controllers/moviesController");


// routes
router.get("/", moviesController.index);

router.get("/:id", moviesController.show);

router.post("/:id/review", moviesController.storeReview);

module.exports = router;