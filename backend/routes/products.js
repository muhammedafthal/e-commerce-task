const express = require("express");

const {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const { protect, admin } = require("../middleware/authMiddleware");
const { check } = require("express-validator");
const validate = require("../middleware/validator");

const router = express.Router();

router
  .route("/")
  .get(getProducts)
  .post(
    protect,
    admin,
    [
      check("name", "Name is required").not().isEmpty(),
      check("category", "Category is required").not().isEmpty(),
      check("price", "Price is required and must be a number").isNumeric(),
      check("stock", "Stock is required and must be a number").isNumeric(),
      check("image", "Image URL is required").not().isEmpty(),
    ],
    validate,
    createProduct,
  );

router
  .route("/:id")
  .patch(
    protect,
    admin,
    [
      check("name", "Name is required").optional().not().isEmpty(),
      check("category", "Category is required").optional().not().isEmpty(),
      check("price", "Price must be a number and cannot be negative")
        .optional()
        .isFloat({ min: 0 }),
      check("stock", "Stock must be a number and cannot be negative")
        .optional()
        .isInt({ min: 0 }),
      check("image", "Image URL is required").optional().not().isEmpty(),
    ],
    validate,
    updateProduct,
  )
  .delete(protect, admin, deleteProduct);

module.exports = router;
