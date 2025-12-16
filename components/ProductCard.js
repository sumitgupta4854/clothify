"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { motion } from "framer-motion";
import Image from "next/image";

export default function ProductCard({ product, onViewDetails, style }) {
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useStore();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const discount =
    product.mrp && product.mrp > product.price
      ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
      : 0;

  const defaultSize = product.sizes?.[0] || "";

  const handleAdd = async (e) => {
    e.preventDefault();
    const form = e.currentTarget.closest("form");
    const size = form.size.value;
    setIsLoading(true);
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 500));
    addToCart(product.id, size, quantity);
    setIsLoading(false);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 3000);
  };

  const handleBuyNow = (e) => {
    e.preventDefault();
    const form = e.currentTarget.closest("form");
    const size = form.size.value;
    if (quantity > product.quantity) {
      alert("Insufficient stock");
      return;
    }
    addToCart(product.id, size, quantity);
    router.push("/checkout");
  };

  const increaseQty = () => setQuantity((prev) => (prev < product.quantity ? prev + 1 : prev));
  const decreaseQty = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleViewDetails = (e) => {
    e.preventDefault();
    router.push(`/products/${product.id}`);
  };

  const handleCardClick = (e) => {
    // Prevent navigation if clicking on buttons or form elements
    if (e.target.tagName === 'BUTTON' || e.target.tagName === 'SELECT' || e.target.tagName === 'OPTION') {
      return;
    }
    router.push(`/products/${product.id}`);
  };

  return (
    <article
      className="product-card"
      onClick={handleCardClick}
      style={{ cursor: 'pointer', ...style }}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${product.name}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick(e);
        }
      }}
    >
      <div className="product-image-container">
        <div className="product-image">
          {product.image && (
            <Image
                src={product.image}
                alt={product.name}
                fill
                style={{
                  objectFit: "cover",
                  imageRendering: "high-quality",
                }}
              />
          )}
          <div className="image-overlay">
            <div className="quick-actions">
              <button
                className="quick-btn"
                onClick={(e) => { e.stopPropagation(); handleViewDetails(e); }}
                style={{ '--index': 0 }}
                aria-label="View product details"
              >
                👁️
              </button>
              <button
                className="quick-btn"
                onClick={(e) => { e.stopPropagation(); handleAdd(e); }}
                style={{ '--index': 1 }}
                aria-label="Add to cart"
                disabled={isLoading}
              >
                🛒
              </button>
            </div>
          </div>
        </div>
        {product.tag && <span className="product-badge">{product.tag}</span>}
        {product.quantity <= 3 && product.quantity > 0 && (
          <span className="stock-badge low-stock image-badge">Only {product.quantity} items left</span>
        )}
        {product.quantity === 0 && (
          <span className="stock-badge out-of-stock image-badge">Out of stock</span>
        )}
        {discount > 0 && <span className="discount-badge">-{discount}%</span>}
        <button
          className={`wishlist-btn ${isInWishlist(product.id) ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            if (isInWishlist(product.id)) {
              removeFromWishlist(product.id);
            } else {
              addToWishlist(product.id);
            }
          }}
          aria-label={isInWishlist(product.id) ? "Remove from wishlist" : "Add to wishlist"}
        >
          {isInWishlist(product.id) ? '❤️' : '🤍'}
        </button>
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name || 'Product Name'}</h3>
        <div className="product-category">{product.category}</div>
        <div className="product-rating">
          <div className="stars">
            {"★".repeat(Math.floor(product.rating))}{"☆".repeat(5 - Math.floor(product.rating))}
          </div>
          <span className="rating-value">({product.rating})</span>
        </div>
        <div className="price-and-stock">
          <div className="price-section">
            <div className="current-price">₹{product.price}</div>
            {product.mrp && product.mrp > product.price && (
              <>
                <div className="original-price">₹{product.mrp}</div>
                <div className="discount-percentage">
                  {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% off
                </div>
              </>
            )}
          </div>
          {product.quantity <= 3 && product.quantity > 0 && (
            <span className="stock-badge low-stock">Only {product.quantity} items left</span>
          )}
          {product.quantity === 0 && (
            <span className="stock-badge out-of-stock">Out of stock</span>
          )}
        </div>
    </div>
      <form className="card-footer">
        <select
          className="size-select"
          name="size"
          defaultValue={defaultSize}
          onClick={(e) => e.stopPropagation()}
          aria-label="Select size"
        >
          {product.sizes?.map((s) => (
            <option key={s} value={s}>
              Size {s}
            </option>
          ))}
        </select>
        <div className="action-buttons">
          <motion.button
            className={`btn primary ${isAdded ? 'success-feedback' : ''} ${isLoading ? 'loading' : ''}`}
            type="button"
            onClick={(e) => { e.stopPropagation(); handleAdd(e); }}
            disabled={product.quantity === 0 || isLoading}
            animate={isAdded ? {
              scale: [1, 1.05, 1],
              transition: { duration: 0.4, ease: "easeOut" }
            } : {}}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{ '--index': 0 }}
            aria-label={isLoading ? "Adding to cart" : isAdded ? "Added to cart" : "Add to cart"}
          >
            {isLoading ? (
              <>
                <span className="loading-spinner"></span>
                Adding...
              </>
            ) : product.quantity === 0 ? (
              "Out of Stock"
            ) : isAdded ? (
              "Added ✓"
            ) : (
              "Add to Cart"
            )}
          </motion.button>
          <motion.button
            className="btn secondary"
            type="button"
            onClick={(e) => { e.stopPropagation(); handleBuyNow(e); }}
            disabled={product.quantity === 0}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{ '--index': 1 }}
            aria-label="Buy now"
          >
            {product.quantity === 0 ? "Out of Stock" : "Buy Now"}
          </motion.button>
        </div>
      </form>
    </article>
  );
}
