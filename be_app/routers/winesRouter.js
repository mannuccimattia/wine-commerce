const express = require("express");
const router = express.Router();

// import controller
const winesController = require("../controllers/winesController");

// routes
router.get("/", winesController.index);

router.get("/:id", winesController.show);

router.post("/cart/:id", winesController.storeCartItem);

router.delete("/cart", winesController.emptyCart);

router.get("/category/:id", winesController.getWineFromCategory);

module.exports = router;
