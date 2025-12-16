"use client";

import { useStore } from "../../../lib/store";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminInventoryPage() {
  const { products, user, updateProductQuantity } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [stockFilter, setStockFilter] = useState('All');


  const categories = ['All', ...new Set(products.map(p => p.category))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || product.category === categoryFilter;
    const matchesStock = stockFilter === 'All' ||
      (stockFilter === 'Out of Stock' && product.quantity === 0) ||
      (stockFilter === 'Low Stock' && product.quantity > 0 && product.quantity <= 3) ||
      (stockFilter === 'In Stock' && product.quantity > 3);

    return matchesSearch && matchesCategory && matchesStock;
  });

  const handleQuantityUpdate = (productId, newQuantity) => {
    updateProductQuantity(productId, Math.max(0, parseInt(newQuantity) || 0));
  };

  const getStockStatus = (quantity) => {
    if (quantity === 0) return { text: 'Out of Stock', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' };
    if (quantity <= 3) return { text: 'Low Stock', color: '#f59e0b', bg: 'rgba(251, 191, 36, 0.1)' };
    return { text: 'In Stock', color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' };
  };

  if (!user) {
    return (
      <div className="page">
        <div className="auth-card" style={{ maxWidth: "400px", margin: "2rem auto" }}>
          <h1>Admin Access Required</h1>
          <p>Please login as admin to access this page.</p>
          <Link href="/login" className="btn primary full">
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="section">
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <Link href="/admin" style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: '1.2rem' }}>
              ← Back to Dashboard
            </Link>
          </div>
          <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem', fontWeight: '700', color: 'var(--text)' }}>
            Inventory Management
          </h1>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '1rem' }}>
            Monitor and update product stock levels
          </p>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <div>
            <label style={{ marginRight: '0.5rem', fontWeight: '500' }}>Category:</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              style={{ padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid var(--border)', background: 'var(--bg-surface)', color: 'var(--text)' }}
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ marginRight: '0.5rem', fontWeight: '500' }}>Stock Status:</label>
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              style={{ padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid var(--border)', background: 'var(--bg-surface)', color: 'var(--text)' }}
            >
              <option value="All">All Stock</option>
              <option value="Out of Stock">Out of Stock</option>
              <option value="Low Stock">Low Stock</option>
              <option value="In Stock">In Stock</option>
            </select>
          </div>

          <div style={{ flex: 1, minWidth: '200px' }}>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '0.5rem',
                border: '1px solid var(--border)',
                background: 'var(--bg-surface)',
                color: 'var(--text)'
              }}
            />
          </div>
        </div>

        {/* Inventory Summary */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            padding: '1rem',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text)', marginBottom: '0.5rem' }}>
              {products.length}
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Total Products</div>
          </div>

          <div style={{
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '8px',
            padding: '1rem',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#10b981', marginBottom: '0.5rem' }}>
              {products.filter(p => p.quantity > 3).length}
            </div>
            <div style={{ color: '#10b981', fontSize: '0.9rem' }}>In Stock</div>
          </div>

          <div style={{
            background: 'rgba(251, 191, 36, 0.1)',
            border: '1px solid rgba(251, 191, 36, 0.3)',
            borderRadius: '8px',
            padding: '1rem',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#f59e0b', marginBottom: '0.5rem' }}>
              {products.filter(p => p.quantity > 0 && p.quantity <= 3).length}
            </div>
            <div style={{ color: '#f59e0b', fontSize: '0.9rem' }}>Low Stock</div>
          </div>

          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '8px',
            padding: '1rem',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#ef4444', marginBottom: '0.5rem' }}>
              {products.filter(p => p.quantity === 0).length}
            </div>
            <div style={{ color: '#ef4444', fontSize: '0.9rem' }}>Out of Stock</div>
          </div>
        </div>

        {/* Inventory Table */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--bg-elevated)', borderBottom: '2px solid var(--border-subtle)' }}>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: 'var(--text)', fontSize: '0.9rem' }}>Product</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: 'var(--text)', fontSize: '0.9rem' }}>Category</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: 'var(--text)', fontSize: '0.9rem' }}>Current Stock</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: 'var(--text)', fontSize: '0.9rem' }}>Status</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: 'var(--text)', fontSize: '0.9rem' }}>Update Stock</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(product => {
                  const stockStatus = getStockStatus(product.quantity);
                  return (
                    <tr key={product.id} style={{
                      borderBottom: '1px solid var(--border-light)',
                      background: product.quantity % 2 === 0 ? 'var(--bg-elevated)' : 'var(--bg-surface)'
                    }}>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <img
                            src={product.image}
                            alt={product.name}
                            style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }}
                          />
                          <div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text)', fontWeight: '500' }}>
                              {product.name}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                              ₹{product.price}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '1rem', fontSize: '0.9rem', color: 'var(--text)' }}>
                        {product.category}
                      </td>
                      <td style={{ padding: '1rem', fontSize: '0.9rem', color: 'var(--text)', fontWeight: '600' }}>
                        {product.quantity}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: '20px',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          background: stockStatus.bg,
                          color: stockStatus.color,
                          border: `1px solid ${stockStatus.color}30`
                        }}>
                          {stockStatus.text}
                        </span>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <input
                            type="number"
                            min="0"
                            value={product.quantity}
                            onChange={(e) => handleQuantityUpdate(product.id, e.target.value)}
                            style={{
                              width: '80px',
                              padding: '0.25rem 0.5rem',
                              borderRadius: '4px',
                              border: '1px solid var(--border)',
                              background: 'var(--bg-surface)',
                              color: 'var(--text)',
                              textAlign: 'center'
                            }}
                          />
                          <button
                            onClick={() => handleQuantityUpdate(product.id, product.quantity + 10)}
                            className="btn success small"
                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                          >
                            +10
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredProducts.length === 0 && (
            <div className="empty-state" style={{ padding: '3rem 1rem' }}>
              <h3>No products found</h3>
              <p>No products match your current filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
