const express = require("express");
const router = express.Router();

// import controller
const winesController = require("../controllers/winesController");


// routes
router.get("/", winesController.index);

router.get("/:id", winesController.show);

router.get("/cart", winesController.indexCart);

router.post("/cart/add/:id", winesController.storeCartItem);

router.delete("/cart", winesController.emptyCart);

module.exports = router;