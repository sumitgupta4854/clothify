"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import Image from "next/image";

export default function ProductModal({ product, onClose }) {
  const { addToCart } = useStore();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || "");
  const [isEnlarged, setIsEnlarged] = useState(false);

  const discount =
    product.mrp && product.mrp > product.price
      ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
      : 0;

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size");
      return;
    }
    addToCart(product.id, selectedSize, quantity);
    onClose();
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      alert("Please select a size");
      return;
    }
    addToCart(product.id, selectedSize, quantity);
    onClose();
    router.push("/checkout");
  };

  const increaseQty = () => setQuantity((prev) => prev + 1);
  const decreaseQty = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button
          className="btn ghost"
          onClick={onClose}
          style={{ position: "absolute", top: "1rem", right: "1rem" }}
        >
          ✕
        </button>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <div style={{ flex: "1", minWidth: "200px" }}>
            <div
              style={{
                position: "relative",
                height: isEnlarged ? "400px" : "250px",
                borderRadius: "0.5rem",
                overflow: "hidden",
                cursor: "pointer",
              }}
              onClick={() => setIsEnlarged(!isEnlarged)}
            >
              {product.image && (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  style={{
                    objectFit: "cover",
                  }}
                />
              )}
            </div>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.5rem" }}>
              Click image to {isEnlarged ? "shrink" : "enlarge"}
            </p>
          </div>
          <div style={{ flex: "1", minWidth: "200px" }}>
            <h3>{product.name}</h3>
            <p style={{ color: "var(--text-muted)" }}>{product.category}</p>
            <div className="price-row">
              <strong>₹{product.price}</strong>
              {product.mrp && (
                <>
                  <span className="mrp">₹{product.mrp}</span>
                  {discount > 0 && <span className="tag">{discount}% off</span>}
                </>
              )}
            </div>
            <div className="rating-row">★ {product.rating}</div>
            <p>{product.description || "No description available"}</p>
            <div style={{ marginTop: "1rem" }}>
              <label>
                Size:
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  style={{ marginLeft: "0.5rem" }}
                >
                  {product.sizes?.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div style={{ marginTop: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span>Quantity:</span>
              <button className="btn ghost" onClick={decreaseQty} style={{ padding: "0.25rem 0.5rem" }}>
                -
              </button>
              <span>{quantity}</span>
              <button className="btn ghost" onClick={increaseQty} style={{ padding: "0.25rem 0.5rem" }}>
                +
              </button>
            </div>
            <div className="action-buttons" style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
              <button className="btn primary" onClick={handleAddToCart}>
                Add to Cart
              </button>
              <button className="btn ghost" onClick={handleBuyNow}>
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}