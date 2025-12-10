"use client";

import { useStore } from "@/lib/store";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import ProductGrid from "@/components/ProductGrid";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ProductDetailPage() {
  const { products, addToCart } = useStore();
  const params = useParams();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const productId = params.id;

  const product = useMemo(() => {
    return products.find(p => p.id === productId);
  }, [products, productId]);

  const suggestions = useMemo(() => {
    if (!product) return [];
    return products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 8);
  }, [products, product]);

  if (!product) {
    return <div className="page">Product not found</div>;
  }

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
  };

  const handleBuyNow = (e) => {
    e.preventDefault();
    const form = e.currentTarget.closest("form");
    const size = form.size.value;
    addToCart(product.id, size, quantity);
    router.push("/checkout");
  };

  const increaseQty = () => setQuantity((prev) => prev + 1);
  const decreaseQty = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  // Placeholder description
  const description = `This is a high-quality ${product.name} from our ${product.category} collection. Made with premium materials for comfort and style. Perfect for everyday wear or special occasions.`;

  return (
    <main className="page product-detail-page">
      <div className="product-detail-container">
        <div className="product-image-section">
          <div className="product-image">
            {product.image && (
              <Image
                src={product.image}
                alt={product.name}
                width={400}
                height={500}
                style={{
                  objectFit: "contain",
                  imageRendering: "high-quality",
                  maxWidth: "100%",
                  height: "auto",
                }}
              />
            )}
          </div>
          {product.tag && <span className="product-badge">{product.tag}</span>}
          {discount > 0 && <span className="discount-badge">-{discount}%</span>}
        </div>

        <div className="product-info-section">
          <div className="product-category">{product.category}</div>
          <h1 className="product-name">{product.name}</h1>
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

          <form className="product-actions" onSubmit={(e) => e.preventDefault()}>
            <label>
              Size
              <select name="size" defaultValue={defaultSize}>
                {product.sizes?.map((s) => (
                  <option key={s} value={s}>
                    Size {s}
                  </option>
                ))}
              </select>
            </label>
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
            <div className="action-buttons">
              <button className="btn primary" type="button" onClick={handleAdd}>
                Add to Cart
              </button>
              <button className="btn secondary" type="button" onClick={handleBuyNow}>
                Buy Now
              </button>
            </div>
          </form>

          <div className="product-description">
            <h3>Description</h3>
            <p>{description}</p>
          </div>
        </div>
      </div>

      {suggestions.length > 0 && (
        <section className="product-suggestions">
          <h2>You might also like</h2>
          <ProductGrid products={suggestions} layout="grid" />
        </section>
      )}
    </main>
  );
}