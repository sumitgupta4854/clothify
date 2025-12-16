"use client";

import { useStore } from "../../lib/store";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";

const statusOptions = [
  { value: 'all', label: 'All Orders' },
  { value: 'placed', label: 'Placed' },
  { value: 'packed', label: 'Packed' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'out_for_delivery', label: 'Out for Delivery' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'cancelled', label: 'Cancelled' },
];

// Simple Bar Chart Component
const BarChart = ({ data, title, color = "#8b5cf6" }) => (
  <div className="chart-container">
    <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', fontWeight: '600' }}>{title}</h4>
    <div style={{ display: 'flex', alignItems: 'end', gap: '0.5rem', height: '120px' }}>
      {data.map((item, index) => {
        const maxValue = Math.max(...data.map(d => d.value));
        const height = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
        return (
          <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
            <div
              style={{
                width: '100%',
                height: `${height}%`,
                background: color,
                borderRadius: '4px 4px 0 0',
                transition: 'height 0.3s ease',
                minHeight: '4px'
              }}
            />
            <span style={{ fontSize: '0.7rem', marginTop: '0.25rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
  </div>
);

// Summary Card Component
const SummaryCard = ({ title, value, icon, color = "#8b5cf6", trend }) => (
  <div className="summary-card" style={{
    background: 'var(--bg-surface)',
    border: '1px solid var(--border-subtle)',
    borderRadius: '12px',
    padding: '1.5rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    cursor: 'pointer'
  }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: '12px',
        background: `${color}15`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.5rem',
        color: color
      }}>
        {icon}
      </div>
      {trend && (
        <span style={{
          fontSize: '0.8rem',
          color: trend > 0 ? 'var(--success)' : 'var(--danger)',
          fontWeight: '500'
        }}>
          {trend > 0 ? '+' : ''}{trend}%
        </span>
      )}
    </div>
    <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem', fontWeight: '700', color: 'var(--text)' }}>
      {value}
    </h3>
    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '500' }}>
      {title}
    </p>
  </div>
);

export default function AdminPage() {
  const { orders, updateOrderStatus, user, products, revenue } = useStore();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [newStatuses, setNewStatuses] = useState({});

  // Calculate metrics
  const metrics = useMemo(() => {
    const today = new Date().toDateString();
    const todayOrders = orders.filter(order => new Date(order.date).toDateString() === today);
    const pendingOrders = orders.filter(order => order.status !== 'delivered');
    const lowStockItems = products.filter(product => product.quantity <= 3);
    const totalUsers = new Set(orders.map(order => order.address?.email || order.address?.name)).size || 120; // Fallback

    return {
      totalOrders: orders.length,
      totalRevenue: revenue,
      todayOrders: todayOrders.length,
      pendingOrders: pendingOrders.length,
      lowStockItems: lowStockItems.length,
      totalUsers
    };
  }, [orders, products, revenue]);

  // Analytics data
  const analytics = useMemo(() => {
    // Orders by period (last 7 days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toDateString();
    }).reverse();

    const ordersByDay = last7Days.map(date => ({
      label: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
      value: orders.filter(order => new Date(order.date).toDateString() === date).length
    }));

    // Revenue trend (simplified - last 7 days)
    const revenueByDay = last7Days.map(date => ({
      label: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
      value: orders
        .filter(order => new Date(order.date).toDateString() === date)
        .reduce((sum, order) => sum + order.total, 0)
    }));

    // Top categories
    const categorySales = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        const category = item.category || 'Other';
        categorySales[category] = (categorySales[category] || 0) + item.qty;
      });
    });

    const topCategories = Object.entries(categorySales)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 4)
      .map(([category, sales]) => ({ label: category, value: sales }));

    // Top products
    const productSales = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        productSales[item.name] = (productSales[item.name] || 0) + item.qty;
      });
    });

    const topProducts = Object.entries(productSales)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([name, sales]) => ({ name, sales }));

    return {
      ordersByDay,
      revenueByDay,
      topCategories,
      topProducts
    };
  }, [orders]);

  // Recent orders (last 10)
  const recentOrders = useMemo(() => {
    return [...orders]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10);
  }, [orders]);

  const handleStatusChange = (orderIndex, newStatus) => {
    updateOrderStatus(orderIndex, newStatus);
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
    <div className="page" style={{ background: 'var(--bg-elevated)', minHeight: '100vh' }}>
      <div className="section" style={{ padding: '2rem 5vw' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem', fontWeight: '700', color: 'var(--text)' }}>
            Admin Dashboard
          </h1>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '1rem' }}>
            Welcome back! Here's what's happening with your store today.
          </p>
        </div>

        {/* Summary Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3rem'
        }}>
          <SummaryCard
            title="Total Orders"
            value={metrics.totalOrders}
            icon="📦"
            color="#8b5cf6"
            trend={12}
          />
          <SummaryCard
            title="Total Revenue"
            value={`₹${metrics.totalRevenue.toLocaleString()}`}
            icon="💰"
            color="#10b981"
            trend={8}
          />
          <SummaryCard
            title="Today's Orders"
            value={metrics.todayOrders}
            icon="📅"
            color="#f59e0b"
            trend={-5}
          />
          <SummaryCard
            title="Pending Orders"
            value={metrics.pendingOrders}
            icon="⏳"
            color="#ef4444"
            trend={-15}
          />
          <SummaryCard
            title="Low Stock Items"
            value={metrics.lowStockItems}
            icon="⚠️"
            color="#f59e0b"
            trend={3}
          />
          <SummaryCard
            title="Total Users"
            value={metrics.totalUsers}
            icon="👥"
            color="#3b82f6"
            trend={25}
          />
        </div>

        {/* Analytics Section */}
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ margin: '0 0 1.5rem 0', fontSize: '1.5rem', fontWeight: '600', color: 'var(--text)' }}>
            Analytics Overview
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            {/* Orders Overview */}
            <div style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
            }}>
              <BarChart data={analytics.ordersByDay} title="Orders Overview (Last 7 Days)" color="#8b5cf6" />
            </div>

            {/* Revenue Trend */}
            <div style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
            }}>
              <BarChart data={analytics.revenueByDay} title="Revenue Trend (Last 7 Days)" color="#10b981" />
            </div>

            {/* Top Categories */}
            <div style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
            }}>
              <h4 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: '600' }}>Top-Selling Categories</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {analytics.topCategories.map((cat, index) => (
                  <div key={cat.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text)' }}>{cat.label}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{
                        width: `${Math.max((cat.value / Math.max(...analytics.topCategories.map(c => c.value))) * 100, 20)}%`,
                        height: '8px',
                        background: '#8b5cf6',
                        borderRadius: '4px'
                      }} />
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '500' }}>
                        {cat.value}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Most Sold Products */}
            <div style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
            }}>
              <h4 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: '600' }}>Most Sold Products</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {analytics.topProducts.map((product, index) => (
                  <div key={product.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text)' }}>
                      {product.name.length > 30 ? product.name.substring(0, 30) + '...' : product.name}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '500' }}>
                      {product.sales} sold
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders Table */}
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600', color: 'var(--text)' }}>
              Recent Orders
            </h2>
            <Link href="/admin/orders" className="btn secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
              View All Orders
            </Link>
          </div>

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
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: 'var(--text)', fontSize: '0.9rem' }}>Order ID</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: 'var(--text)', fontSize: '0.9rem' }}>Customer</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: 'var(--text)', fontSize: '0.9rem' }}>Product</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: 'var(--text)', fontSize: '0.9rem' }}>Size</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: 'var(--text)', fontSize: '0.9rem' }}>Color</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: 'var(--text)', fontSize: '0.9rem' }}>Amount</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: 'var(--text)', fontSize: '0.9rem' }}>Payment</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: 'var(--text)', fontSize: '0.9rem' }}>Status</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: 'var(--text)', fontSize: '0.9rem' }}>Date</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: 'var(--text)', fontSize: '0.9rem' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order, index) => {
                    const originalIndex = orders.findIndex(o => o.id === order.id);
                    const firstItem = order.items[0];
                    return (
                      <tr key={order.id} style={{
                        borderBottom: '1px solid var(--border-light)',
                        background: index % 2 === 0 ? 'var(--bg-elevated)' : 'var(--bg-surface)'
                      }}>
                        <td style={{ padding: '1rem', fontSize: '0.9rem', color: 'var(--primary)', fontWeight: '500' }}>
                          <Link href={`/admin/orders/${order.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                            {order.id}
                          </Link>
                        </td>
                        <td style={{ padding: '1rem', fontSize: '0.9rem', color: 'var(--text)' }}>
                          {order.address?.name || 'N/A'}
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <img
                              src={firstItem?.image || '/placeholder.jpg'}
                              alt={firstItem?.name || 'Product'}
                              style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }}
                            />
                            <span style={{ fontSize: '0.9rem', color: 'var(--text)' }}>
                              {firstItem?.name || 'N/A'}
                              {order.items.length > 1 && ` +${order.items.length - 1} more`}
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: '1rem', fontSize: '0.9rem', color: 'var(--text)' }}>
                          {firstItem?.size || 'N/A'}
                        </td>
                        <td style={{ padding: '1rem', fontSize: '0.9rem', color: 'var(--text)' }}>
                          N/A
                        </td>
                        <td style={{ padding: '1rem', fontSize: '0.9rem', color: 'var(--text)', fontWeight: '600' }}>
                          ₹{order.total}
                        </td>
                        <td style={{ padding: '1rem', fontSize: '0.9rem', color: 'var(--text)' }}>
                          {order.paymentMethod || 'COD'}
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <select
                            value={newStatuses[order.id] || order.status}
                            onChange={(e) => setNewStatuses(prev => ({ ...prev, [order.id]: e.target.value }))}
                            style={{
                              padding: '0.25rem 0.5rem',
                              borderRadius: '6px',
                              border: '1px solid var(--border)',
                              background: 'var(--bg-surface)',
                              color: 'var(--text)',
                              fontSize: '0.8rem'
                            }}
                          >
                            {statusOptions.slice(1).map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td style={{ padding: '1rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                          {order.date}
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <Link href={`/admin/orders/${order.id}`} className="btn small" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}>
                              View
                            </Link>
                            <button
                              className="btn small secondary"
                              style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                              onClick={() => {
                                const newStatus = newStatuses[order.id];
                                if (newStatus && newStatus !== order.status) {
                                  handleStatusChange(originalIndex, newStatus);
                                  setNewStatuses(prev => {
                                    const copy = { ...prev };
                                    delete copy[order.id];
                                    return copy;
                                  });
                                }
                              }}
                              disabled={!newStatuses[order.id] || newStatuses[order.id] === order.status}
                            >
                              Update
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Inventory Alerts */}
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ margin: '0 0 1.5rem 0', fontSize: '1.5rem', fontWeight: '600', color: 'var(--text)' }}>
            Inventory Alerts
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem'
          }}>
            {products.filter(p => p.quantity <= 3).map(product => (
              <div key={product.id} style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '12px',
                padding: '1.5rem',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: product.quantity === 0 ? 'rgba(239, 68, 68, 0.1)' :
                             product.quantity <= 2 ? 'rgba(245, 158, 11, 0.1)' : 'rgba(234, 179, 8, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  color: product.quantity === 0 ? '#ef4444' :
                         product.quantity <= 2 ? '#f59e0b' : '#eab308'
                }}>
                  {product.quantity === 0 ? '🚫' : product.quantity <= 2 ? '⚠️' : '🔔'}
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', color: 'var(--text)' }}>
                    {product.name}
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '500' }}>
                    {product.quantity === 0 ? 'Out of Stock' : `Only ${product.quantity} left in stock`}
                  </p>
                  <div style={{
                    marginTop: '0.5rem',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    background: product.quantity === 0 ? 'rgba(239, 68, 68, 0.1)' :
                               product.quantity <= 2 ? 'rgba(245, 158, 11, 0.1)' : 'rgba(234, 179, 8, 0.1)',
                    color: product.quantity === 0 ? '#ef4444' :
                           product.quantity <= 2 ? '#f59e0b' : '#eab308',
                    border: `1px solid ${product.quantity === 0 ? 'rgba(239, 68, 68, 0.3)' :
                                          product.quantity <= 2 ? 'rgba(245, 158, 11, 0.3)' : 'rgba(234, 179, 8, 0.3)'}`,
                    display: 'inline-block'
                  }}>
                    {product.quantity === 0 ? 'Critical' :
                     product.quantity <= 2 ? 'Low Stock' : 'Warning'}
                  </div>
                </div>
              </div>
            ))}
            {products.filter(p => p.quantity <= 3).length === 0 && (
              <div style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '12px',
                padding: '2rem',
                textAlign: 'center',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                gridColumn: '1 / -1'
              }}>
                <div style={{
                  fontSize: '3rem',
                  marginBottom: '1rem',
                  color: 'var(--success)'
                }}>✅</div>
                <h4 style={{
                  margin: '0 0 0.5rem 0',
                  fontSize: '1.2rem',
                  color: 'var(--text)',
                  fontWeight: '600'
                }}>All Good!</h4>
                <p style={{
                  margin: 0,
                  color: 'var(--text-muted)',
                  fontSize: '1rem'
                }}>No inventory alerts at the moment.</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 style={{ margin: '0 0 1.5rem 0', fontSize: '1.5rem', fontWeight: '600', color: 'var(--text)' }}>
            Quick Actions
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem'
          }}>
            <Link href="/admin/products" className="btn primary" style={{
              padding: '1rem',
              textAlign: 'center',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}>
              ➕ Add New Product
            </Link>

            <Link href="/admin/orders" className="btn secondary" style={{
              padding: '1rem',
              textAlign: 'center',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}>
              📦 Manage Orders
            </Link>

            <Link href="/admin/inventory" className="btn secondary" style={{
              padding: '1rem',
              textAlign: 'center',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}>
              📊 Update Inventory
            </Link>

            <Link href="/admin/offers" className="btn secondary" style={{
              padding: '1rem',
              textAlign: 'center',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}>
              🎯 Create Offers
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
