"use client";

import { useState } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";

export default function CheckoutPage() {
  const { cart, placeOrder } = useStore();
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const [form, setForm] = useState({
    fullName: "",
    mobile: "",
    address: "",
    city: "",
    pincode: "",
    paymentMethod: "cod",
  });
  const [successOrderId, setSuccessOrderId] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!cart.length) {
      alert("Cart is empty");
      return;
    }
    const order = placeOrder(form);
    if (order) {
      setSuccessOrderId(order.id);
    }
  };

  return (
    <main className="page checkout-page">
      <section className="checkout-form-card">
        <div className="section-header">
          <h2>Checkout</h2>
          <p>Enter your details to place the order.</p>
        </div>
        {successOrderId ? (
          <div className="success-msg">
            <h3>Order Placed!</h3>
            <p>Your order {successOrderId} has been placed successfully.</p>
            <Link href="/orders" className="btn ghost">
              Go to Orders
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <label>
                Full Name
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Mobile
                <input
                  type="tel"
                  name="mobile"
                  value={form.mobile}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Address
                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                City
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Pincode
                <input
                  type="text"
                  name="pincode"
                  value={form.pincode}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Payment Method
                <select
                  name="paymentMethod"
                  value={form.paymentMethod}
                  onChange={handleChange}
                  required
                >
                  <option value="cod">Cash on Delivery</option>
                  <option value="card">Card</option>
                  <option value="upi">UPI</option>
                </select>
              </label>
            </div>
            <div className="checkout-summary">
              <p>
                Total Payable: ₹<span id="checkoutTotal">{total}</span>
              </p>
              <button type="submit" className="btn primary full">
                Place Order
              </button>
            </div>
          </form>
        )}
      </section>
    </main>
  );
}
