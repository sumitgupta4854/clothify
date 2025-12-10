"use client";

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
    );
  }

  return (
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
              <article key={order.id} className="order-card">
                <div className="order-card-header">
                  <div>
                    <strong>{order.id}</strong>
                    <div className="muted">{order.date}</div>
                  </div>
                  <span className="order-status">{order.status}</span>
                </div>
                <div className="order-items">{itemsSummary}</div>
                <div className="muted">Total: ₹{order.total}</div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
