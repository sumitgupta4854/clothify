"use client";

import { useParams } from "next/navigation";
import { useStore } from "@/lib/store";
import Link from "next/link";

export default function OrderDetailsPage() {
  const { id } = useParams();
  const { orders } = useStore();
  const order = orders.find((o) => o.id === id);

  if (!order) {
    return (
      <main className="page">
        <section className="section">
          <div className="empty-state">
            <p>Order not found.</p>
            <Link href="/orders" className="btn primary">
              Back to Orders
            </Link>
          </div>
        </section>
      </main>
    );
  }

  // Define tracking steps based on order status
  const getTrackingSteps = () => {
    const steps = [
      { step: "Order Placed", date: order.date, completed: false },
      { step: "Packed", date: null, completed: false },
      { step: "Shipped", date: null, completed: false },
      { step: "Out for Delivery", date: null, completed: false },
      { step: "Delivered", date: null, completed: false },
    ];

    const statusMap = {
      "placed": 0,
      "packed": 1,
      "shipped": 2,
      "out_for_delivery": 3,
      "delivered": 4,
    };

    const currentIndex = statusMap[order.status] || 0;

    // Mark steps as completed up to but not including current status
    for (let i = 0; i < currentIndex; i++) {
      steps[i].completed = true;
    }

    // Current step gets timestamp if not delivered
    if (order.status !== "delivered") {
      steps[currentIndex].date = new Date().toLocaleString();
    } else {
      // All steps completed for delivered orders
      steps.forEach(step => step.completed = true);
      steps[4].date = new Date().toLocaleString();
    }

    return steps;
  };

  const tracking = getTrackingSteps();
  const currentStepIndex = tracking.findIndex((step) => !step.completed);
  const eta = order.status === "delivered" ? "Delivered" :
               currentStepIndex >= 0 ? "In Progress" : "Delivered";

  return (
    <main className="page">
      <section className="section">
        <div className="section-header">
          <h2>Order Details</h2>
          <Link href="/orders" className="btn ghost">
            Back to Orders
          </Link>
        </div>

        <div className="order-details-container">
          <div className="order-summary-card">
            <div className="order-header">
              <div>
                <h3>{order.id}</h3>
                <p className="muted">{order.date}</p>
              </div>
              <span className={`order-status ${order.status.toLowerCase()}`}>
                {order.status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </span>
            </div>

            <div className="order-items-list">
              {order.items.map((item, index) => (
                <div key={index} className="order-item">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="order-item-image"
                  />
                  <div className="order-item-details">
                    <h4>{item.name}</h4>
                    <p className="muted">Size: {item.size} | Qty: {item.qty}</p>
                    <p className="muted">₹{item.price} each</p>
                  </div>
                  <div className="order-item-total">₹{item.price * item.qty}</div>
                </div>
              ))}
            </div>

            <div className="order-total">
              <strong>Total: ₹{order.total}</strong>
            </div>
          </div>

          <div className="tracking-card">
            <h3>Order Tracking</h3>
            <div className="tracking-timeline">
              {tracking.map((step, index) => (
                <div
                  key={index}
                  className={`tracking-step ${step.completed ? "completed" : "pending"} ${
                    index === currentStepIndex && !step.completed ? "current" : ""
                  }`}
                >
                  <div className="tracking-icon">
                    {step.completed ? "✓" : index === currentStepIndex ? "●" : "○"}
                  </div>
                  <div className="tracking-content">
                    <h4>{step.step}</h4>
                    {step.completed && step.date && <p className="muted">{step.date}</p>}
                    {!step.completed && index === currentStepIndex && <p className="muted">In Progress</p>}
                  </div>
                </div>
              ))}
            </div>
            <div className="eta-info">
              <p><strong>Estimated Delivery:</strong> {eta}</p>
            </div>
          </div>

          <div className="address-card">
            <h3>Delivery Address</h3>
            <div className="address-details">
              <p>{order.address.name}</p>
              <p>{order.address.street}</p>
              <p>{order.address.city}, {order.address.state} {order.address.zip}</p>
              <p>{order.address.phone}</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}