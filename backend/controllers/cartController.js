const Cart = require("../models/Cart");
const Product = require("../models/Product");

// @desc    Get user cart
// @route   GET /cart
// @access  User
const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product",
    );

    if (!cart) {
      cart = { user: req.user._id, items: [] };
    }

    let total = 0;
    if (cart.items && cart.items.length > 0) {
      cart.items.forEach((item) => {
        if (item.product) {
          total += item.product.price * item.quantity;
        }
      });
    }

    res.json({
      cart,
      total,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to cart
// @route   POST /cart
// @access  User
const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    if (quantity <= 0) {
      res.status(400);
      throw new Error("Quantity must be greater than zero");
    }

    if (product.stock < quantity) {
      res.status(400);
      throw new Error("Not enough stock available");
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (cart) {
      const itemIndex = cart.items.findIndex(
        (p) => p.product.toString() === productId,
      );

      if (itemIndex > -1) {
        const newQuantity = cart.items[itemIndex].quantity + quantity;
        if (newQuantity > product.stock) {
          res.status(400);
          throw new Error("Cannot add more than available stock");
        }
        cart.items[itemIndex].quantity = newQuantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }
    } else {
      cart = await Cart.create({
        user: req.user._id,
        items: [{ product: productId, quantity }],
      });
    }

    await cart.save();
    res.status(201).json(cart);
  } catch (error) {
    next(error);
  }
};

// @desc    Update cart item quantity
// @route   PATCH /cart/:id
// @access  User
const updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const productId = req.params.id; // Treat :id as productId

    if (quantity <= 0) {
      res.status(400);
      throw new Error("Quantity must be greater than zero");
    }

    const product = await Product.findById(productId);
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    if (product.stock < quantity) {
      res.status(400);
      throw new Error("Not enough stock available");
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      res.status(404);
      throw new Error("Cart not found");
    }

    const itemIndex = cart.items.findIndex(
      (p) => p.product.toString() === productId,
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = quantity;
      await cart.save();
      res.json(cart);
    } else {
      res.status(404);
      throw new Error("Item not found in cart");
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from cart
// @route   DELETE /cart/:id
// @access  User
const removeCartItem = async (req, res, next) => {
  try {
    const productId = req.params.id;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      res.status(404);
      throw new Error("Cart not found");
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId,
    );
    await cart.save();

    res.json(cart);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
};
