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
  const [sortType, setSortType] = useState("popularity");
  const [sortDirection, setSortDirection] = useState("asc");
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
    // Sorting logic
    if (sortType === "price") {
      list.sort((a, b) => sortDirection === "asc" ? a.price - b.price : b.price - a.price);
    } else if (sortType === "name") {
      list.sort((a, b) => sortDirection === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));
    } else if (sortType === "popularity") {
      // Assuming popularity is based on id or some field, for now sort by id
      list.sort((a, b) => sortDirection === "asc" ? a.id - b.id : b.id - a.id);
    }
    return list;
  }, [products, category, sortType, sortDirection, search]);

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
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
          >
            <option value="popularity">Popularity</option>
            <option value="price">Price</option>
            <option value="name">Name</option>
          </select>
        </label>
        <label>
          Order
          <button
            className={`sort-toggle ${sortDirection === "asc" ? "asc" : "desc"}`}
            onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
          >
            {sortType === "price" && (sortDirection === "asc" ? "Low to High" : "High to Low")}
            {sortType === "name" && (sortDirection === "asc" ? "A-Z" : "Z-A")}
            {sortType === "popularity" && (sortDirection === "asc" ? "Oldest" : "Newest")}
          </button>
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
