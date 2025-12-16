"use client";

import { useStore } from "../../../lib/store";
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

const sortOptions = [
  { value: 'date_desc', label: 'Newest First' },
  { value: 'date_asc', label: 'Oldest First' },
  { value: 'total_desc', label: 'Highest Amount' },
  { value: 'total_asc', label: 'Lowest Amount' },
];

export default function AdminOrdersPage() {
  const { orders, updateOrderStatus, deleteOrder, user } = useStore();
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date_desc');
  const [searchTerm, setSearchTerm] = useState('');


  const filteredAndSortedOrders = useMemo(() => {
    let filtered = orders;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Filter by search term (order ID or customer name)
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.address?.name && order.address.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Sort orders
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date_desc':
          return new Date(b.date) - new Date(a.date);
        case 'date_asc':
          return new Date(a.date) - new Date(b.date);
        case 'total_desc':
          return b.total - a.total;
        case 'total_asc':
          return a.total - b.total;
        default:
          return 0;
      }
    });

    return filtered;
  }, [orders, statusFilter, sortBy, searchTerm]);

  const handleStatusChange = (orderIndex, newStatus) => {
    updateOrderStatus(orderIndex, newStatus);
  };

  const handleRejectOrder = (orderIndex, event) => {
    event?.preventDefault();
    event?.stopPropagation();
    if (window.confirm('Are you sure you want to reject this order?')) {
      updateOrderStatus(orderIndex, 'rejected');
    }
  };

  const handleDeleteOrder = (orderIndex, event) => {
    event?.preventDefault();
    event?.stopPropagation();
    if (window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      deleteOrder(orderIndex);
    }
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
            Order Management
          </h1>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '1rem' }}>
            Manage and track all customer orders
          </p>
        </div>

        {/* Filters and Search */}
        <div className="sorting-section">
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div>
              <label style={{ marginRight: '0.5rem', fontWeight: '500' }}>Status:</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{ padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid var(--border)', background: 'var(--bg-surface)', color: 'var(--text)' }}
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ marginRight: '0.5rem', fontWeight: '500' }}>Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{ padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid var(--border)', background: 'var(--bg-surface)', color: 'var(--text)' }}
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            <div style={{ flex: 1, minWidth: '200px' }}>
              <input
                type="text"
                placeholder="Search by Order ID or Customer Name..."
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
        </div>

        {/* Orders Table */}
        <div className="products-table-container">
          <div className="table-header">
            <h3>Orders ({filteredAndSortedOrders.length})</h3>
          </div>

          <div className="table-wrapper">
            <table className="products-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedOrders.map((order, index) => {
                  const originalIndex = orders.findIndex(o => o.id === order.id);
                  return (
                    <tr key={order.id} className={
                      order.status === 'delivered' ? 'delivered-row' :
                      order.status === 'placed' ? '' : ''
                    }>
                      <td>
                        <Link href={`/admin/orders/${order.id}`} style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '500' }}>
                          {order.id}
                        </Link>
                      </td>
                      <td>{order.address?.name || 'N/A'}</td>
                      <td>{order.date}</td>
                      <td>{order.items.length} item{order.items.length !== 1 ? 's' : ''}</td>
                      <td>₹{order.total}</td>
                      <td>
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(originalIndex, e.target.value)}
                          className="status-select"
                        >
                          {statusOptions.slice(1).map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          <Link href={`/admin/orders/${order.id}`} className="btn small">
                            View
                          </Link>
                          <button
                            type="button"
                            onClick={(e) => handleRejectOrder(originalIndex, e)}
                            className="btn small secondary"
                            disabled={order.status === 'rejected' || order.status === 'cancelled' || order.status === 'delivered'}
                          >
                            Reject
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleDeleteOrder(originalIndex, e)}
                            className="btn small danger"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredAndSortedOrders.length === 0 && (
            <div className="empty-state">
              <h3>No orders found</h3>
              <p>No orders match your current filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
