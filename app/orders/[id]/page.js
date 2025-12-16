"use client";

<<<<<<< HEAD
import { useStore } from "../../../lib/store";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

const statusSteps = [
  { key: 'placed', label: 'Order Placed', icon: '📦' },
  { key: 'packed', label: 'Order Packed', icon: '📦' },
  { key: 'shipped', label: 'Shipped', icon: '🚚' },
  { key: 'out_for_delivery', label: 'Out for Delivery', icon: '🚚' },
  { key: 'delivered', label: 'Delivered', icon: '✅' },
];

const paymentMethods = {
  card: { icon: '💳', label: 'Credit/Debit Card' },
  upi: { icon: '📱', label: 'UPI' },
  cod: { icon: '💵', label: 'Cash on Delivery' },
};

export default function OrderDetailsPage() {
  const { orders, user } = useStore();
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light');
  }, []);

  useEffect(() => {
    if (orders.length > 0 && params.id) {
      const foundOrder = orders.find(o => o.id === params.id);
      if (foundOrder) {
        setOrder(foundOrder);
      } else {
        router.push('/orders');
      }
    }
  }, [orders, params.id, router]);

  if (!user) {
    return (
      <div className="page">
        <div className="auth-card" style={{ maxWidth: "400px", margin: "2rem auto" }}>
          <h1>Please Login</h1>
          <p>You need to be logged in to view order details.</p>
          <Link href="/login" className="btn primary full">
            Login
          </Link>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="page">
        <div className="section">
          <div className="loading-spinner"></div>
          <p>Loading order details...</p>
        </div>
      </div>
    );
  }

  const currentStepIndex = statusSteps.findIndex(step => step.key === order.status);

  return (
    <div className="page">
      <div className="section">
        <div className="order-header">
          <div>
            <h2>Order #{order.id}</h2>
            <p className="muted">Placed on {order.date}</p>
          </div>
          <div className={`order-status ${order.status}`}>
            {order.status.replace('_', ' ').toUpperCase()}
          </div>
=======
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
>>>>>>> 3c8d2e00d65f001eb55f8c8ddef0ab3d537da2b8
        </div>

        <div className="order-details-container">
          <div className="order-summary-card">
<<<<<<< HEAD
            <h3>Order Summary</h3>
            <div className="order-items-list">
              {order.items.map((item, index) => (
                <div key={index} className="order-item">
                  <img src={item.image} alt={item.name} className="order-item-image" />
                  <div className="order-item-details">
                    <h4>{item.name}</h4>
                    <p>Size: {item.size} • Quantity: {item.qty}</p>
                    <p className="muted">{item.category}</p>
=======
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
>>>>>>> 3c8d2e00d65f001eb55f8c8ddef0ab3d537da2b8
                  </div>
                  <div className="order-item-total">₹{item.price * item.qty}</div>
                </div>
              ))}
            </div>
<<<<<<< HEAD
=======

>>>>>>> 3c8d2e00d65f001eb55f8c8ddef0ab3d537da2b8
            <div className="order-total">
              <strong>Total: ₹{order.total}</strong>
            </div>
          </div>

          <div className="tracking-card">
            <h3>Order Tracking</h3>
            <div className="tracking-timeline">
<<<<<<< HEAD
              {statusSteps.map((step, index) => (
                <div
                  key={step.key}
                  className={`tracking-step ${
                    index < currentStepIndex ? 'completed' :
                    index === currentStepIndex ? 'current' : 'pending'
                  }`}
                >
                  <div className="tracking-icon">{step.icon}</div>
                  <div className="tracking-content">
                    <h4>{step.label}</h4>
                    {index === currentStepIndex && (
                      <p>Estimated delivery: 2-3 business days</p>
                    )}
=======
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
>>>>>>> 3c8d2e00d65f001eb55f8c8ddef0ab3d537da2b8
                  </div>
                </div>
              ))}
            </div>
<<<<<<< HEAD
=======
            <div className="eta-info">
              <p><strong>Estimated Delivery:</strong> {eta}</p>
            </div>
>>>>>>> 3c8d2e00d65f001eb55f8c8ddef0ab3d537da2b8
          </div>

          <div className="address-card">
            <h3>Delivery Address</h3>
            <div className="address-details">
<<<<<<< HEAD
              {order.address ? (
                <>
                  <p><strong>{order.address.name}</strong></p>
                  <p>{order.address.street}</p>
                  <p>{order.address.city}, {order.address.state} {order.address.pincode}</p>
                  <p>Phone: {order.address.phone}</p>
                </>
              ) : (
                <p>Address not available</p>
              )}
            </div>
          </div>

          <div className="address-card">
            <h3>Payment Information</h3>
            <div className="address-details">
              <p>
                <span style={{ fontSize: '1.2rem', marginRight: '0.5rem' }}>
                  {paymentMethods[order.paymentMethod || 'cod'].icon}
                </span>
                {paymentMethods[order.paymentMethod || 'cod'].label}
              </p>
              <p>Amount Paid: ₹{order.total}</p>
              <p>Payment Status: <span style={{ color: 'var(--success)' }}>Paid</span></p>
              {order.transactionId && (
                <p>Transaction ID: {order.transactionId}</p>
              )}
            </div>
          </div>
        </div>

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <Link href="/orders" className="btn secondary">
            ← Back to Orders
          </Link>
        </div>
      </div>
    </div>
=======
              <p>{order.address.name}</p>
              <p>{order.address.street}</p>
              <p>{order.address.city}, {order.address.state} {order.address.zip}</p>
              <p>{order.address.phone}</p>
            </div>
          </div>
        </div>
      </section>
    </main>
>>>>>>> 3c8d2e00d65f001eb55f8c8ddef0ab3d537da2b8
  );
}