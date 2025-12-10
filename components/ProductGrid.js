"use client";

import ProductCard from "./ProductCard";

export default function ProductGrid({ products, layout = "scroll" }) {
  return (
    <div className={layout === "grid" ? "product-grid" : "product-scroll"}>
      {products.map((p, index) => (
        <ProductCard
          key={p.id}
          product={p}
          onViewDetails={() => {}} // Not used anymore
          style={{ animationDelay: `${index * 0.1}s` }}
        />
      ))}
    </div>
  );
}
