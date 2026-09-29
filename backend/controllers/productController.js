const Product = require("../models/Product");

// @desc    Fetch all products
// @route   GET /products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const { search, price, sort } = req.query;
    let query = {};

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    // e.g., ?price[gte]=100&price[lte]=500
    if (price) {
      query.price = price;
    }

    let queryObj = Product.find(query);

    if (sort) {
      // e.g., ?sort=price or ?sort=-price
      const sortBy = sort.split(",").join(" ");
      queryObj = queryObj.sort(sortBy);
    } else {
      queryObj = queryObj.sort("-createdAt"); // Default sort
    }

    const products = await queryObj;
    res.json(products);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a product
// @route   POST /products
// @access  Admin
const createProduct = async (req, res, next) => {
  try {
    const product = new Product(req.body);
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(400);
    next(error);
  }
};

// @desc    Update a product
// @route   PATCH /products/:id
// @access  Admin
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      Object.assign(product, req.body);
      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product
// @route   DELETE /products/:id
// @access  Admin
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      res.json({ message: "Product removed" });
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
