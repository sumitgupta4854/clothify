"use client";

import { Suspense } from "react";
import { useStore } from "@/lib/store";
import ProductGrid from "@/components/ProductGrid";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

function ProductsContent() {
  const { products } = useStore();
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get("category") || "All";
  const searchFromUrl = searchParams.get("search") || "";

  const [category, setCategory] = useState(categoryFromUrl);
  const [sortBy, setSortBy] = useState("popularity");
  const [search, setSearch] = useState(searchFromUrl);

  const categories = ["All", ...new Set(products.map(p => p.category))];

  const filtered = useMemo(() => {
    let list = [...products];
    if (category !== "All") {
      list = list.filter((p) => p.category === category);
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q));
    }
    if (sortBy === "priceLowHigh") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === "priceHighLow") {
      list.sort((a, b) => b.price - a.price);
    }
    return list;
  }, [products, category, sortBy, search]);

  return (
    <main className="page page-grid">
      <aside className="filters">
        <h3>Filters</h3>
        <label>
          Category
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </label>
        <label>
          Sort by
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="popularity">Popularity</option>
            <option value="priceLowHigh">Price: Low to High</option>
            <option value="priceHighLow">Price: High to Low</option>
          </select>
        </label>
        <label>
          Search
          <input
            type="text"
            className="search-input"
            placeholder="Search for clothes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
      </aside>

      <section className="products-section">
        <div className="section-header">
          <h2>All Products</h2>
          <p>Explore our complete catalog.</p>
        </div>
        <ProductGrid products={filtered} layout="grid" />
      </section>
    </main>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
