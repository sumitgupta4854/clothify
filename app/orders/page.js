"use client";

import { useStore } from "../../lib/store";
import Link from "next/link";

export default function OrdersPage() {
  const { orders, user } = useStore();

  if (!user) {
    return (
      <div className="page">
        <div className="auth-card" style={{ maxWidth: "400px", margin: "2rem auto" }}>
          <h1>Please Login</h1>
          <p>You need to be logged in to view your orders.</p>
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
        <div className="section-header">
          <h2>My Orders</h2>
          <p>Track and manage your recent purchases</p>
        </div>

        {orders.length === 0 ? (
          <div className="empty-state">
            <h3>No orders yet</h3>
            <p>You haven't placed any orders yet. Start shopping to see your orders here.</p>
            <Link href="/products" className="btn primary">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="order-list">
            {orders.map((order, index) => (
              <Link key={order.id} href={`/orders/${order.id}`} className="order-card-link">
                <div className="order-card">
                  <div className="order-card-header">
                    <div>
                      <h3>Order #{order.id}</h3>
                      <p className="muted">{order.date}</p>
                    </div>
                    <div className={`order-status ${order.status}`}>
                      {order.status.replace('_', ' ').toUpperCase()}
                    </div>
                  </div>
                  <div className="order-items">
                    {order.items.length} item{order.items.length !== 1 ? 's' : ''} • ₹{order.total}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
