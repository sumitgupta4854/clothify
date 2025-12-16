"use client";

import { useStore } from "@/lib/store";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

export default function WishlistPage() {
  const { wishlist, products } = useStore();

  const wishlistProducts = products.filter(product => wishlist.includes(product.id));

  return (
    <main>
      <section className="page">
        <div className="section-header">
          <h1>My Wishlist</h1>
          <p>Your saved items for later</p>
        </div>

        {wishlistProducts.length === 0 ? (
          <div className="empty-state">
            <h3>Your wishlist is empty</h3>
            <p>Start adding items you love to your wishlist!</p>
            <Link href="/products" className="btn primary">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="product-grid">
            {wishlistProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={() => {}}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}