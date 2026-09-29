import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { Search, Filter, ShoppingCart, AlertCircle } from "lucide-react";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("-createdAt");

  const { user } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get(`/products?search=${search}&sort=${sort}`);
      setProducts(data);
    } catch (err) {
      setError("Failed to load products. Network error or server is down.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, [sort]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const handleAddToCart = async (product) => {
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      await addToCart(product._id, 1);
      alert(`${product.name} added to cart!`);
    } catch (err) {
      alert(err.response?.data?.message || "Error adding to cart");
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <form onSubmit={handleSearch} className="flex w-full md:w-1/2 relative">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          <button type="submit" className="hidden">
            Search
          </button>
        </form>

        <div className="flex items-center w-full md:w-auto">
          <Filter className="text-gray-400 mr-2" size={20} />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition appearance-none bg-white"
          >
            <option value="-createdAt">Newest First</option>
            <option value="price">Price: Low to High</option>
            <option value="-price">Price: High to Low</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-6 rounded-xl flex flex-col items-center justify-center h-64 border border-red-100">
          <AlertCircle size={48} className="mb-4 text-red-400" />
          <p className="text-lg font-medium">{error}</p>
          <button
            onClick={fetchProducts}
            className="mt-4 text-indigo-600 font-medium hover:underline"
          >
            Try Again
          </button>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-gray-500 bg-white rounded-xl shadow-sm border border-gray-100">
          <ShoppingCart size={48} className="mx-auto mb-4 text-gray-300" />
          <h2 className="text-2xl font-semibold text-gray-700">
            No products found
          </h2>
          <p className="mt-2">Try adjusting your search query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-100 flex flex-col group"
            >
              <div className="relative h-48 overflow-hidden bg-gray-100 flex items-center justify-center p-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/400?text=No+Image";
                  }}
                />
                {product.stock === 0 && (
                  <div className="absolute inset-0 bg-white/70 flex items-center justify-center backdrop-blur-sm">
                    <span className="bg-red-500 text-white px-4 py-1 rounded-full font-bold shadow-sm transform -rotate-12">
                      OUT OF STOCK
                    </span>
                  </div>
                )}
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <div className="text-xs font-semibold text-indigo-500 uppercase tracking-wider mb-1">
                  {product.category}
                </div>
                <h3 className="text-lg font-bold text-gray-800 leading-tight mb-2 flex-grow">
                  {product.name}
                </h3>
                <div className="flex items-end justify-between mt-4">
                  <div className="text-xl font-black text-gray-900">
                    ${product.price}
                  </div>
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock === 0}
                    className={`flex items-center justify-center px-4 py-2 rounded-lg font-medium transition shadow-sm ${
                      product.stock === 0
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-indigo-600 text-white hover:bg-indigo-700 active:transform active:scale-95"
                    }`}
                  >
                    <ShoppingCart size={18} className="mr-2" />
                    {product.stock === 0 ? "Unavailable" : "Add"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
