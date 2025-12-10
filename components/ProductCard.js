"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { motion } from "framer-motion";
import Image from "next/image";

export default function ProductCard({ product, onViewDetails, style }) {
  const { addToCart } = useStore();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const discount =
    product.mrp && product.mrp > product.price
      ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
      : 0;

  const defaultSize = product.sizes?.[0] || "";

  const handleAdd = (e) => {
    e.preventDefault();
    const form = e.currentTarget.closest("form");
    const size = form.size.value;
    addToCart(product.id, size, quantity);
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
    <article className="product-card" onClick={handleCardClick} style={{ cursor: 'pointer', ...style }}>
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
              <button className="quick-btn" onClick={(e) => { e.stopPropagation(); handleViewDetails(e); }}>
                👁️
              </button>
              <button className="quick-btn" onClick={(e) => { e.stopPropagation(); handleAdd(e); }}>
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
      </div>
      <div className="product-info">
        <div className="product-category">{product.category}</div>
        <h3 className="product-name">{product.name}</h3>
        <div className="product-rating">
          <div className="stars">
            {"★".repeat(Math.floor(product.rating))}{"☆".repeat(5 - Math.floor(product.rating))}
          </div>
          <span className="rating-value">({product.rating})</span>
          <span className="rating-count">• {Math.floor(Math.random() * 500) + 50} reviews</span>
        </div>
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
      <form className="card-footer">
        <select
          className="size-select"
          name="size"
          defaultValue={defaultSize}
          onClick={(e) => e.stopPropagation()}
        >
          {product.sizes?.map((s) => (
            <option key={s} value={s}>
              Size {s}
            </option>
          ))}
        </select>
        <div className="action-buttons">
          <motion.button
            className="btn primary"
            type="button"
            onClick={(e) => { e.stopPropagation(); handleAdd(e); }}
            disabled={product.quantity === 0}
            animate={isAdded ? {
              scale: [1, 1.1, 1],
              backgroundColor: "#22c55e",
              transition: { duration: 0.5 }
            } : {}}
            whileTap={{ scale: 0.95 }}
          >
            {product.quantity === 0 ? "Out of Stock" : isAdded ? "Added ✓" : "Add to Cart"}
          </motion.button>
          <button className="btn secondary" type="button" onClick={(e) => { e.stopPropagation(); handleBuyNow(e); }} disabled={product.quantity === 0}>
            {product.quantity === 0 ? "Out of Stock" : "Buy Now"}
          </button>
        </div>
      </form>
    </article>
  );
}
