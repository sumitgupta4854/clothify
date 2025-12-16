"use client";

<<<<<<< HEAD
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
=======
import Link from "next/link";
import { useStore } from "@/lib/store";

export default function OrdersPage() {
  const { orders } = useStore();

  if (!orders.length) {
    return (
      <main className="page">
        <section className="orders-page">
          <div className="section-header">
            <h2>Your Orders</h2>
          </div>
          <div className="empty-state">
            <p>No orders yet. Start shopping to see them here.</p>
            <Link href="/products" className="btn primary">
              Shop Now
            </Link>
          </div>
        </section>
      </main>
>>>>>>> 3c8d2e00d65f001eb55f8c8ddef0ab3d537da2b8
    );
  }

  return (
<<<<<<< HEAD
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
=======
    <main className="page">
      <section className="orders-page">
        <div className="section-header">
          <h2>Your Orders</h2>
        </div>
        <div className="order-list">
          {orders.map((order) => {
            const itemsSummary = order.items
              .map((i) => `${i.name} x${i.qty} (${i.size})`)
              .join(", ");
            return (
              <Link key={order.id} href={`/orders/${order.id}`} className="order-card-link">
                <article className="order-card">
                  <div className="order-card-header">
                    <div>
                      <strong>{order.id}</strong>
                      <div className="muted">{order.date}</div>
                    </div>
                    <span className="order-status">{order.status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                  </div>
                  <div className="order-items">{itemsSummary}</div>
                  <div className="muted">Total: ₹{order.total}</div>
                </article>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
>>>>>>> 3c8d2e00d65f001eb55f8c8ddef0ab3d537da2b8
  );
}
