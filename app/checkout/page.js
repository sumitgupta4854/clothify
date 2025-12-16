"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";

export default function CheckoutPage() {
  const { cart, placeOrder } = useStore();
  const router = useRouter();
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const [form, setForm] = useState({
    fullName: "",
    mobile: "",
    address: "",
    city: "",
    pincode: "",
    paymentMethod: "cod",
    cardNumber: "",
    expiry: "",
    cvv: "",
    cardName: "",
    upiId: "",
    bank: "",
  });
  const [selectedUpiProvider, setSelectedUpiProvider] = useState("");
  const [upiExpanded, setUpiExpanded] = useState(false);
  const [successOrderId, setSuccessOrderId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});

  const validateMobile = (value) => {
    if (value && !/^\d{10}$/.test(value)) {
      return "Mobile number must be exactly 10 digits";
    }
    return "";
  };

  const validatePincode = (value) => {
    if (value && !/^\d{5,6}$/.test(value)) {
      return "Pincode must be 5-6 digits";
    }
    return "";
  };

  const validateUpi = (value) => {
    if (value && !/^[a-zA-Z0-9._]+@[a-zA-Z0-9]+$/.test(value)) {
      return "UPI ID must be in format username@bank";
    }
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === 'mobile' || name === 'pincode') {
      newValue = value.replace(/\D/g, '');
      if (name === 'mobile') newValue = newValue.slice(0, 10);
      if (name === 'pincode') newValue = newValue.slice(0, 6);
    }

    setForm((prev) => ({ ...prev, [name]: newValue }));

    let errorMsg = '';
    if (name === 'mobile') errorMsg = validateMobile(newValue);
    if (name === 'pincode') errorMsg = validatePincode(newValue);
    if (name === 'upiId') errorMsg = validateUpi(newValue);

    setErrors((prev) => ({ ...prev, [name]: errorMsg }));

    // Handle payment method change
    if (name === 'paymentMethod') {
      if (value === 'upi') {
        setUpiExpanded(true);
      } else {
        setUpiExpanded(false);
        setSelectedUpiProvider("");
        setForm(prev => ({ ...prev, upiId: "" }));
        setErrors(prev => ({ ...prev, upiId: "" }));
      }
    }
  };

  const handleUpiProviderSelect = (provider) => {
    setSelectedUpiProvider(provider);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!cart.length) {
      setError("Cart is empty");
      return;
    }
    setLoading(true);

    const hasErrors = Object.values(errors).some(err => err !== '');
    if (hasErrors) {
      setError("Please fix the validation errors before placing the order.");
      setLoading(false);
      return;
    }

    // Place order for all payment methods
    const order = placeOrder(form);
    if (order) {
      setSuccessOrderId(order.id);
    } else {
      setError("Failed to place order");
    }
    setLoading(false);
  };

  return (
    <main className="page checkout-page">
      <div className="checkout-container">
        <div className="checkout-left">
          {successOrderId ? (
            <div className="success-msg">
              <h3>Payment Successful!</h3>
              <p>Your order {successOrderId} has been placed successfully.</p>
              <Link href={`/orders/${successOrderId}`} className="btn primary">
                View Order Details
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <section className="checkout-section">
                <h2>Delivery Address</h2>
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
                  {errors.mobile && <p className="error-text">{errors.mobile}</p>}
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
                  {errors.pincode && <p className="error-text">{errors.pincode}</p>}
                </div>
              </section>

              <section className="checkout-section">
                <h2>Payment Method</h2>
                <div className="payment-methods">
                  <label className="payment-card">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={form.paymentMethod === "cod"}
                      onChange={handleChange}
                    />
                    <div className="payment-card-content">
                      <span className="payment-icon">💰</span>
                      <div>
                        <h4>Cash on Delivery</h4>
                        <p>Pay when you receive</p>
                      </div>
                    </div>
                  </label>
                  <label className="payment-card">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={form.paymentMethod === "card"}
                      onChange={handleChange}
                    />
                    <div className="payment-card-content">
                      <span className="payment-icon">💳</span>
                      <div>
                        <h4>Credit / Debit Card</h4>
                        <p>Visa, Mastercard, etc.</p>
                      </div>
                    </div>
                  </label>
                  <label className="payment-card">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="upi"
                      checked={form.paymentMethod === "upi"}
                      onChange={handleChange}
                    />
                    <div className="payment-card-content">
                      <span className="payment-icon">📱</span>
                      <div>
                        <h4>UPI</h4>
                        <p>Pay using UPI apps</p>
                      </div>
                    </div>
                    {upiExpanded && (
                      <div className="upi-providers">
                        <div
                          className={`upi-provider ${selectedUpiProvider === 'gpay' ? 'selected' : ''}`}
                          onClick={() => handleUpiProviderSelect('gpay')}
                        >
                          <span className="upi-icon">🔵</span>
                          <span>Google Pay</span>
                        </div>
                        <div
                          className={`upi-provider ${selectedUpiProvider === 'phonepe' ? 'selected' : ''}`}
                          onClick={() => handleUpiProviderSelect('phonepe')}
                        >
                          <span className="upi-icon">🟡</span>
                          <span>PhonePe</span>
                        </div>
                        <div
                          className={`upi-provider ${selectedUpiProvider === 'paytm' ? 'selected' : ''}`}
                          onClick={() => handleUpiProviderSelect('paytm')}
                        >
                          <span className="upi-icon">🟣</span>
                          <span>Paytm</span>
                        </div>
                        <div
                          className={`upi-provider ${selectedUpiProvider === 'other' ? 'selected' : ''}`}
                          onClick={() => handleUpiProviderSelect('other')}
                        >
                          <span className="upi-icon">📱</span>
                          <span>Other UPI</span>
                        </div>
                      </div>
                    )}
                  </label>
                  <label className="payment-card">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="netbanking"
                      checked={form.paymentMethod === "netbanking"}
                      onChange={handleChange}
                    />
                    <div className="payment-card-content">
                      <span className="payment-icon">🏦</span>
                      <div>
                        <h4>Net Banking</h4>
                        <p>Online banking</p>
                      </div>
                    </div>
                  </label>
                </div>

                {form.paymentMethod === "card" && (
                  <div className="payment-details">
                    <h4>Card Details</h4>
                    <div className="card-form-grid">
                      <label className="full-width">
                        Card Number
                        <input
                          type="text"
                          name="cardNumber"
                          value={form.cardNumber}
                          onChange={handleChange}
                          placeholder="1234 5678 9012 3456"
                        />
                      </label>
                      <div className="card-row">
                        <label>
                          Expiry (MM/YY)
                          <input
                            type="text"
                            name="expiry"
                            value={form.expiry}
                            onChange={handleChange}
                            placeholder="MM/YY"
                          />
                        </label>
                        <label className="cvv-label">
                          CVV <span className="info-icon" title="3-digit security code on the back of your card">ℹ️</span>
                          <input
                            type="text"
                            name="cvv"
                            value={form.cvv}
                            onChange={handleChange}
                            placeholder="123"
                          />
                        </label>
                      </div>
                      <label className="full-width">
                        Cardholder Name
                        <input
                          type="text"
                          name="cardName"
                          value={form.cardName}
                          onChange={handleChange}
                          placeholder="John Doe"
                        />
                      </label>
                    </div>
                  </div>
                )}
                {form.paymentMethod === "upi" && selectedUpiProvider && (
                  <div className="payment-details">
                    <h4>UPI Details</h4>
                    <label>
                      UPI ID
                      <input
                        type="text"
                        name="upiId"
                        value={form.upiId}
                        onChange={handleChange}
                        placeholder="example@upi"
                      />
                    </label>
                    {errors.upiId && <p className="error-text">{errors.upiId}</p>}
                  </div>
                )}
                {form.paymentMethod === "netbanking" && (
                  <div className="payment-details">
                    <h4>Net Banking</h4>
                    <label>
                      Select Bank
                      <select
                        name="bank"
                        value={form.bank}
                        onChange={handleChange}
                      >
                        <option value="">Select Bank</option>
                        <option value="sbi">State Bank of India</option>
                        <option value="hdfc">HDFC Bank</option>
                        <option value="icici">ICICI Bank</option>
                        <option value="axis">Axis Bank</option>
                      </select>
                    </label>
                  </div>
                )}
              </section>

              {error && <p className="error-msg">{error}</p>}

              <div className="checkout-actions">
                <button type="submit" className="btn primary full" disabled={loading}>
                  {loading ? 'Processing...' : (form.paymentMethod === "upi" && selectedUpiProvider ? 'Pay Now' : 'Place Order')}
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="checkout-right">
          <div className="order-summary-sticky">
            <h3>Order Summary</h3>
            <div className="order-items">
              {cart.map((item, index) => (
                <div key={index} className="order-item">
                  <img src={item.image} alt={item.name} />
                  <div className="order-item-details">
                    <h4>{item.name}</h4>
                    <p>Size: {item.size} | Qty: {item.qty}</p>
                    <p>₹{item.price * item.qty}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="order-total">
              <p>Total: ₹{total}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
