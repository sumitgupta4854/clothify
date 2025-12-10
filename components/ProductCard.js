"use client";

import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import Image from "next/image";

export default function ProductCard({ product, onViewDetails, style }) {
  const { addToCart } = useStore();
  const router = useRouter();

  const discount =
    product.mrp && product.mrp > product.price
      ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
      : 0;

  const defaultSize = product.sizes?.[0] || "";

  const handleAdd = (e) => {
    e.preventDefault();
    const form = e.currentTarget.closest("form");
    const size = form.size.value;
    addToCart(product.id, size);
  };

  const handleBuyNow = (e) => {
    e.preventDefault();
    const form = e.currentTarget.closest("form");
    const size = form.size.value;
    addToCart(product.id, size);
    router.push("/checkout");
  };

  const handleViewDetails = (e) => {
    e.preventDefault();
    onViewDetails(product);
  };

  const handleCardClick = (e) => {
    // Prevent modal if clicking on buttons or form elements
    if (e.target.tagName === 'BUTTON' || e.target.tagName === 'SELECT' || e.target.tagName === 'OPTION') {
      return;
    }
    onViewDetails(product);
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
        {discount > 0 && <span className="discount-badge">-{discount}%</span>}
      </div>
      <div className="product-info">
        <div className="product-category">{product.category}</div>
        <h3 className="product-name">{product.name}</h3>
        <div className="product-rating">
          <div className="stars">
            {"★".repeat(Math.floor(product.rating))}{"☆".repeat(5 - Math.floor(product.rating))}
          </div>
          <span className="rating-value">{product.rating}</span>
        </div>
        <div className="price-section">
          <div className="current-price">₹{product.price}</div>
          {product.mrp && product.mrp > product.price && (
            <div className="original-price">₹{product.mrp}</div>
          )}
        </div>
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
          <button className="btn primary" type="button" onClick={(e) => { e.stopPropagation(); handleAdd(e); }}>
            Add to Cart
          </button>
          <button className="btn secondary" type="button" onClick={(e) => { e.stopPropagation(); handleBuyNow(e); }}>
            Buy Now
          </button>
        </div>
      </form>
    </article>
  );
}
