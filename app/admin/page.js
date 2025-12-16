"use client";

<<<<<<< HEAD
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
=======
import { useState } from "react";
import { useStore } from "@/lib/store";

const tabs = ["overview", "products", "orders", "users"];

export default function AdminPage() {
  const {
    products,
    orders,
    user,
    revenue,
    addProduct,
    deleteProduct,
    deleteOrder,
    updateOrderStatus,
  } = useStore();
  const [activeTab, setActiveTab] = useState("overview");

  const [newProd, setNewProd] = useState({
    name: "",
    category: "Men",
    price: "",
    mrp: "",
    rating: 4.5,
    sizes: "S,M,L,XL",
    tag: "New",
    image: "",
    quantity: 10,
  });

  const [imageFile, setImageFile] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleViewOrderDetails = (order) => {
    setSelectedOrder(order);
  };

  const closeModal = () => {
    setSelectedOrder(null);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setNewProd({
      name: product.name,
      category: product.category,
      price: product.price,
      mrp: product.mrp,
      rating: product.rating,
      sizes: product.sizes.join(","),
      tag: product.tag,
      image: product.image,
      quantity: product.quantity,
    });
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setEditingProduct(null);
    setShowEditModal(false);
    setNewProd({
      name: "",
      category: "Men",
      price: "",
      mrp: "",
      rating: 4.5,
      sizes: "S,M,L,XL",
      tag: "New",
      image: "",
      quantity: 10,
    });
    setImageFile(null);
  };


  const handleProdChange = (e) => {
    const { name, value } = e.target;
    setNewProd((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewProd((prev) => ({ ...prev, image: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProduct = (e) => {
    e.preventDefault();
    if (!editingProduct) return;
    if (!newProd.name || !newProd.price || !newProd.mrp) {
      alert("Please fill in all required fields (Name, Price, MRP)");
      return;
    }
    const payload = {
      name: newProd.name,
      category: newProd.category,
      price: Number(newProd.price),
      mrp: Number(newProd.mrp),
      rating: Number(newProd.rating),
      sizes: newProd.sizes
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      tag: newProd.tag || "New",
      image: newProd.image || "",
      quantity: Number(newProd.quantity) || 10,
    };
    // For simplicity, delete and add new (since no update function)
    deleteProduct(editingProduct.id);
    addProduct(payload);
    setEditingProduct(null);
    setShowEditModal(false);
    setNewProd({
      name: "",
      category: "Men",
      price: "",
      mrp: "",
      rating: 4.5,
      sizes: "S,M,L,XL",
      tag: "New",
      image: "",
      quantity: 10,
    });
    setImageFile(null);
    alert("Product updated successfully");
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newProd.name || !newProd.price || !newProd.mrp) {
      alert("Please fill in all required fields (Name, Price, MRP)");
      return;
    }
    const payload = {
      name: newProd.name,
      category: newProd.category,
      price: Number(newProd.price),
      mrp: Number(newProd.mrp),
      rating: Number(newProd.rating),
      sizes: newProd.sizes
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      tag: newProd.tag || "New",
      image: newProd.image || "",
      quantity: Number(newProd.quantity) || 10,
    };
    addProduct(payload);
    setShowEditModal(false);
    setNewProd({
      name: "",
      category: "Men",
      price: "",
      mrp: "",
      rating: 4.5,
      sizes: "S,M,L,XL",
      tag: "New",
      image: "",
      quantity: 10,
    });
    setImageFile(null);
    alert("Product added successfully");
  };

  return (
    <main className="page admin-page">
      <section className="admin-layout">
        <aside className="admin-sidebar">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={
                activeTab === tab ? "admin-tab active" : "admin-tab"
              }
              onClick={() => setActiveTab(tab)}
            >
              {tab[0].toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </aside>

        <section className="admin-content">
          {activeTab === "overview" && (
            <div className="admin-section">
              <h2>Overview</h2>
              <div className="admin-grid">
                <div className="admin-card">
                  <h3>Total Products</h3>
                  <p className="admin-metric">{products.length}</p>
                  <p className="muted">All active catalog items.</p>
                </div>
                <div className="admin-card">
                  <h3>Total Orders</h3>
                  <p className="admin-metric">{orders.length}</p>
                  <p className="muted">Across all time.</p>
                </div>
                <div className="admin-card">
                  <h3>Revenue (Demo)</h3>
                  <p className="admin-metric">₹{revenue}</p>
                  <p className="muted">Sum of all order totals.</p>
                </div>
                <div className="admin-card">
                  <h3>Registered Users</h3>
                  <p className="admin-metric">{user ? 1 : 0}</p>
                  <p className="muted">From front-end demo auth.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "products" && (
            <div className="admin-section">
              <h2>Product Management</h2>
              <p className="muted">
                Manage your product catalog. Changes are saved in browser localStorage.
              </p>
              <div className="product-management-layout">
                <div className="products-table-container">
                  <div className="table-header">
                    <h3>Existing Products</h3>
                    <button className="btn primary" onClick={() => setShowEditModal(true)}>
                      Add New Product
                    </button>
                  </div>
                  <div className="table-wrapper">
                    <table className="products-table">
                      <thead className="table-header-fixed">
                        <tr>
                          <th>Name</th>
                          <th>Category</th>
                          <th>Price</th>
                          <th>MRP</th>
                          <th>Rating</th>
                          <th>Quantity</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((p, index) => (
                          <tr key={p.id} className={index % 2 === 0 ? "even-row" : "odd-row"}>
                            <td>
                              <div className="product-name-cell">
                                <span>{p.name}</span>
                                {p.tag === "New" && <span className="badge-new">New</span>}
                              </div>
                            </td>
                            <td>{p.category}</td>
                            <td>₹{p.price}</td>
                            <td>₹{p.mrp}</td>
                            <td>{p.rating}</td>
                            <td>{p.quantity}</td>
                            <td>
                              <div className="action-buttons">
                                <button
                                  className="btn ghost small"
                                  onClick={() => handleEditProduct(p)}
                                >
                                  Edit
                                </button>
                                <button
                                  className="btn danger small"
                                  onClick={() => deleteProduct(p.id)}
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "orders" && (
            <div className="admin-section">
              <h2>Order Management</h2>
              <p className="muted">
                Update order status. This also reflects in customer "My Orders" page.
              </p>
              {!orders.length ? (
                <p className="muted empty-text">No orders yet.</p>
              ) : (
                <div className="products-table-container">
                  <div className="table-wrapper">
                    <table className="products-table">
                      <thead className="table-header-fixed">
                        <tr>
                          <th>Customer</th>
                          <th>Date</th>
                          <th>Items</th>
                          <th>Total</th>
                          <th>Status</th>
                          <th>Details</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order, idx) => {
                          const itemsCount = order.items.reduce(
                            (sum, i) => sum + i.qty,
                            0
                          );
                          return (
                            <tr key={order.id} className={`${idx % 2 === 0 ? "even-row" : "odd-row"} ${order.status === "Delivered" ? "delivered-row" : order.status === "Rejected" ? "rejected-row" : ""}`}>
                              <td>{order.address?.fullName || 'N/A'}</td>
                              <td>{order.date}</td>
                              <td>{itemsCount} item(s)</td>
                              <td>₹{order.total}</td>
                              <td>
                                <select
                                  value={order.status}
                                  onChange={(e) =>
                                    updateOrderStatus(idx, e.target.value)
                                  }
                                  className="status-select"
                                >
                                  <option value="placed">Placed</option>
                                  <option value="packed">Packed</option>
                                  <option value="shipped">Shipped</option>
                                  <option value="out_for_delivery">Out for Delivery</option>
                                  <option value="delivered">Delivered</option>
                                </select>
                              </td>
                              <td>
                                <button
                                  className="btn ghost small"
                                  onClick={() => handleViewOrderDetails(order)}
                                >
                                  See Details
                                </button>
                              </td>
                              <td>
                                <button
                                  className="btn danger small"
                                  onClick={() => deleteOrder(idx)}
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "users" && (
            <div className="admin-section">
              <h2>Users</h2>
              <p className="muted">
                Simple user list based on front-end demo auth.
              </p>
              {!user ? (
                <p className="muted empty-text">No users registered yet.</p>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                    </tr>
                  </tbody>
                </table>
              )}
            </div>
          )}
        </section>
      </section>

      {selectedOrder && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Order Details</h3>
            <div className="order-summary">
              <p><strong>Order ID:</strong> {selectedOrder.id}</p>
              <p><strong>Date:</strong> {selectedOrder.date}</p>
              <p><strong>Status:</strong> {selectedOrder.status}</p>
              <p><strong>Total:</strong> ₹{selectedOrder.total}</p>
            </div>
            <div className="customer-details">
              <h4>Customer Details</h4>
              <p><strong>Name:</strong> {selectedOrder.address?.fullName || 'N/A'}</p>
              <p><strong>Phone:</strong> {selectedOrder.address?.mobile || 'N/A'}</p>
              <p><strong>Address:</strong> {selectedOrder.address?.address || 'N/A'}, {selectedOrder.address?.city || 'N/A'}, {selectedOrder.address?.pincode || 'N/A'}</p>
            </div>
            <div className="order-items">
              <h4>Items Ordered</h4>
              <ul>
                {selectedOrder.items.map((item, idx) => {
                  const product = products.find(p => p.id === item.id);
                  return (
                    <li key={idx} className="order-item">
                      {product?.image && <img src={product.image} alt={item.name} className="order-item-image" />}
                      <div className="order-item-details">
                        {item.name} ({item.size}) - Qty: {item.qty} - ₹{item.price * item.qty}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
            <button className="btn primary" onClick={closeModal}>Close</button>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="edit-modal-overlay" onClick={closeEditModal}>
          <div className="edit-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingProduct ? "Edit Product" : "Add New Product"}</h3>
              <button className="close-btn" onClick={closeEditModal}>×</button>
            </div>
            <form className="edit-form" onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}>
              <div className="form-grid">
                <label>
                  Name
                  <input
                    type="text"
                    name="name"
                    value={newProd.name}
                    onChange={handleProdChange}
                    required
                  />
                </label>
                <label>
                  Category
                  <select
                    name="category"
                    value={newProd.category}
                    onChange={handleProdChange}
                  >
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Kids">Kids</option>
                    <option value="Winter">Winter</option>
                  </select>
                </label>
                <label>
                  Price (₹)
                  <input
                    type="number"
                    name="price"
                    value={newProd.price}
                    onChange={handleProdChange}
                    required
                  />
                </label>
                <label>
                  MRP (₹)
                  <input
                    type="number"
                    name="mrp"
                    value={newProd.mrp}
                    onChange={handleProdChange}
                    required
                  />
                </label>
                <label>
                  Rating (0–5)
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    name="rating"
                    value={newProd.rating}
                    onChange={handleProdChange}
                    required
                  />
                </label>
                <label>
                  Quantity
                  <input
                    type="number"
                    name="quantity"
                    value={newProd.quantity}
                    onChange={handleProdChange}
                    min="0"
                    required
                  />
                </label>
              </div>
              <label>
                Sizes (comma separated)
                <input
                  type="text"
                  name="sizes"
                  value={newProd.sizes}
                  onChange={handleProdChange}
                  required
                />
              </label>
              <label>
                Tag
                <input
                  type="text"
                  name="tag"
                  value={newProd.tag}
                  onChange={handleProdChange}
                />
              </label>
              <label>
                Product Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
              <div className="form-actions">
                <button type="submit" className="btn primary">
                  {editingProduct ? "Update Product" : "Add Product"}
                </button>
                <button type="button" className="btn ghost" onClick={closeEditModal}>
                  Cancel
                </button>
              </div>
            </form>
            <p className="muted small-note">
              Note: This is a front-end only admin. Data is stored in your browser (localStorage) only.
            </p>
          </div>
        </div>
      )}
    </main>
>>>>>>> 3c8d2e00d65f001eb55f8c8ddef0ab3d537da2b8
  );
}
