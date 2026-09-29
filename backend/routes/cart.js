const express = require("express");
const {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
} = require("../controllers/cartController");
const { protect } = require("../middleware/authMiddleware");
const { check } = require("express-validator");
const validate = require("../middleware/validator");

const router = express.Router();

router
  .route("/")
  .get(protect, getCart)
  .post(
    protect,
    [
      check("productId", "Product ID is required").not().isEmpty(),
      check(
        "quantity",
        "Quantity is required and must be a positive number",
      ).isInt({ min: 1 }),
    ],
    validate,
    addToCart,
  );

router
  .route("/:id")
  .patch(
    protect,
    [
      check(
        "quantity",
        "Quantity is required and must be a positive number",
      ).isInt({ min: 1 }),
    ],
    validate,
    updateCartItem,
  )
  .delete(protect, removeCartItem);

module.exports = router;
