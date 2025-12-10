"use client";

import Link from "next/link";
import ProductGrid from "@/components/ProductGrid";
import { useStore } from "@/lib/store";

export default function HomePage() {
  const { products } = useStore();
  const featured = [...products].sort((a, b) => parseInt(b.id.slice(1)) - parseInt(a.id.slice(1))).slice(0, 6);

  return (
    <main>
      <section className="hero">
        <div className="floating-shape-1"></div>
        <div className="floating-shape-2"></div>
        <div className="hero-content">
          <div className="hero-text">
            <h1>Discover Your Style</h1>
            <p>
              Elevate your wardrobe with trendy outfits, comfortable fits, and premium quality fashion — all curated just for you.
            </p>
            <div className="hero-actions">
              <Link href="/products" className="btn primary">
                Explore Collection
              </Link>
              <a href="#categories" className="btn ghost">
                Browse Categories
              </a>
            </div>
            <div className="hero-features">
              <div className="feature">
                <span className="icon">🚚</span>
                <span>Free delivery over ₹499</span>
              </div>
              <div className="feature">
                <span className="icon">↩️</span>
                <span>Easy 7-day returns</span>
              </div>
              <div className="feature">
                <span className="icon">🔒</span>
                <span>Secure payments</span>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-showcase">
              <div className="showcase-item large">
                <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=400&fit=crop" alt="Fashion Sale" />
                <div className="showcase-overlay">
                  <span className="badge">Up to 50% OFF</span>
                  <h3>Summer Sale</h3>
                </div>
              </div>
              <div className="showcase-item">
                <img src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=300&fit=crop" alt="Women Fashion" />
                <div className="showcase-overlay">
                  <span className="badge">New</span>
                  <h4>Women Trends</h4>
                </div>
              </div>
              <div className="showcase-item">
                <img src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=300&fit=crop" alt="Festive Collection" />
                <div className="showcase-overlay">
                  <span className="badge">Festive</span>
                  <h4>Party Wear</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="categories" className="section">
        <div className="section-header">
          <h2>Shop by Category</h2>
          <p>Everything you need, from basics to party wear.</p>
        </div>
        <div className="category-grid">
          <Link href="/products?category=Men" className="category-card">
            <h3>Men</h3>
            <p>Casuals, formals &amp; more</p>
          </Link>
          <Link href="/products?category=Women" className="category-card">
            <h3>Women</h3>
            <p>Dresses, tops &amp; more</p>
          </Link>
          <Link href="/products?category=Kids" className="category-card">
            <h3>Kids</h3>
            <p>Playful &amp; comfy</p>
          </Link>
          <Link href="/products?category=Winter" className="category-card">
            <h3>Winter</h3>
            <p>Jackets, hoodies &amp; more</p>
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2>Trending Now</h2>
          <p>Most loved styles this week.</p>
          <Link href="/products" className="btn ghost">
            View All Products
          </Link>
        </div>
        <ProductGrid products={featured} />
      </section>

      <section className="section fashion-ads">
        <div className="ads-grid">
          <div className="ad-card">
            <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&fit=scale-down" alt="Summer Sale - Up to 60% OFF" />
            <div className="ad-content">
              <h3>Summer Fashion Sale</h3>
              <p>Up to 60% OFF on all summer collections</p>
              <Link href="/products" className="btn primary">Shop Now</Link>
            </div>
          </div>
          <div className="ad-card">
            <img src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1200&h=600&fit=scale-down" alt="Women Fashion - Trendy Styles" />
            <div className="ad-content">
              <h3>Women Fashion</h3>
              <p>Discover the latest women fashion trends</p>
              <Link href="/products?category=Women" className="btn primary">Explore</Link>
            </div>
          </div>
          <div className="ad-card">
            <img src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&h=600&fit=scale-down" alt="Exclusive Deals - Limited Time" />
            <div className="ad-content">
              <h3>Exclusive Deals</h3>
              <p>Limited time offers on premium brands</p>
              <Link href="/products" className="btn primary">View Deals</Link>
            </div>
          </div>
        </div>
      </section>

      {['Men', 'Women', 'Kids', 'Winter', 'Accessories', 'Shoes', 'Activewear', 'Jewelry', 'Bags'].map(category => {
        const categoryProducts = products.filter(p => p.category === category);
        return (
          <section key={category} className="section">
            <div className="section-header">
              <h2>{category} Collection</h2>
              <p>Discover our latest {category.toLowerCase()} fashion.</p>
              <Link href={`/products?category=${category}`} className="btn ghost">
                View All {category}
              </Link>
            </div>
            <ProductGrid products={categoryProducts} />
          </section>
        );
      })}

      <section className="section deals-strip">
        <div className="deal-card">
          <h3>Student Discount</h3>
          <p>Extra 10% off on all items.</p>
        </div>
        <div className="deal-card">
          <h3>Bank Offers</h3>
          <p>Up to ₹500 cashback on select cards.</p>
        </div>
        <div className="deal-card">
          <h3>Same Day Dispatch</h3>
          <p>On orders before 3PM.</p>
        </div>
      </section>
    </main>
  );
}
