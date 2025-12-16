"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useStore } from "@/lib/store";
<<<<<<< HEAD
import { motion } from "framer-motion";
=======
import { useTheme } from "@/lib/theme";
>>>>>>> 3c8d2e00d65f001eb55f8c8ddef0ab3d537da2b8

const navItems = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Shop" },
  { href: "/orders", label: "Orders" },
  { href: "/profile", label: "Profile" },
];

export default function Topbar() {
  const pathname = usePathname();
  const router = useRouter();
<<<<<<< HEAD
  const { cartCount, wishlist } = useStore();
=======
  const { cartCount } = useStore();
  const { theme, toggleTheme } = useTheme();
>>>>>>> 3c8d2e00d65f001eb55f8c8ddef0ab3d537da2b8
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="topbar">
      <div className="logo">
        <Link href="/">
          Clothify<span>.</span>
        </Link>
      </div>
      <div className="search-wrapper">
        <div className="search-icon">🔍</div>
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
<<<<<<< HEAD
        {navItems.map((item, index) => (
          <motion.div
            key={item.href}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
          >
            <Link
              href={item.href}
              className={pathname === item.href ? "nav-link active" : "nav-link"}
            >
              {item.label}
            </Link>
          </motion.div>
        ))}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: navItems.length * 0.1, duration: 0.3 }}
        >
          <Link
            href="/cart"
            className={pathname === "/cart" ? "cart-link active" : "cart-link"}
          >
            <span className="cart-icon">🛒</span>
            <span className="cart-text">Cart ({cartCount})</span>
          </Link>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: (navItems.length + 1) * 0.1, duration: 0.3 }}
        >
          <Link
            href="/wishlist"
            className={pathname === "/wishlist" ? "wishlist-link active" : "wishlist-link"}
          >
            <span className="wishlist-icon">❤️</span>
            <span className="wishlist-text">Wishlist ({wishlist.length})</span>
          </Link>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: (navItems.length + 2) * 0.1, duration: 0.3 }}
        >
          <Link
            href="/admin"
            className={pathname.startsWith("/admin") ? "admin-chip active" : "admin-chip"}
          >
            Admin
          </Link>
        </motion.div>
=======
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={pathname === item.href ? "nav-link active" : "nav-link"}
          >
            {item.label}
          </Link>
        ))}
        <Link
          href="/cart"
          className={pathname === "/cart" ? "cart-link active" : "cart-link"}
        >
          <span className="cart-icon">🛒</span>
          <span className="cart-text">Cart</span>
          {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
        </Link>
        <button
          onClick={toggleTheme}
          className="theme-toggle"
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        <Link
          href="/admin"
          className={pathname.startsWith("/admin") ? "admin-chip active" : "admin-chip"}
        >
          Admin
        </Link>
>>>>>>> 3c8d2e00d65f001eb55f8c8ddef0ab3d537da2b8
      </nav>
    </header>
  );
}
