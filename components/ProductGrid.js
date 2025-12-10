"use client";

import { useState } from "react";
import ProductCard from "./ProductCard";
import ProductModal from "./ProductModal";

export default function ProductGrid({ products, layout = "scroll" }) {
  const [selectedProduct, setSelectedProduct] = useState(null);

  const openModal = (product) => {
    setSelectedProduct(product);
  };

  const closeModal = () => {
    setSelectedProduct(null);
  };

  return (
    <>
      <div className={layout === "grid" ? "product-grid" : "product-scroll"}>
        {products.map((p, index) => (
          <ProductCard
            key={p.id}
            product={p}
            onViewDetails={openModal}
            style={{ animationDelay: `${index * 0.1}s` }}
          />
        ))}
      </div>
      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={closeModal} />
      )}
    </>
  );
}
