"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useStore } from "@/lib/store";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Shop" },
  { href: "/orders", label: "Orders" },
  { href: "/profile", label: "Profile" },
];

export default function Topbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { cartCount } = useStore();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="topbar">
      <div className="logo">
        Clothify<span>.</span>
      </div>
      <div className="search-wrapper">
        <input
          type="text"
          className="search-input"
          placeholder="Search for T-shirts, jeans, dresses..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleSearch}
        />
      </div>
      <nav className="nav-links">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={pathname === item.href ? "active" : ""}
          >
            {item.label}
          </Link>
        ))}
        <Link
          href="/cart"
          className={pathname === "/cart" ? "cart-link active" : "cart-link"}
        >
          Cart <span className="cart-count">{cartCount}</span>
        </Link>
        <Link
          href="/admin"
          className={pathname.startsWith("/admin") ? "admin-chip active" : "admin-chip"}
        >
          Admin
        </Link>
      </nav>
    </header>
  );
}
