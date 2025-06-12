const express = require("express");
const router = express.Router();

// import controller
const winesController = require("../controllers/winesController");


// routes
router.get("/", winesController.index);

router.get("/:id", winesController.show);

router.post("/:id/review", winesController.storeReview);

module.exports = router;