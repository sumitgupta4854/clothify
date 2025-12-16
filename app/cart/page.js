"use client";

import Link from "next/link";
import Image from "next/image";
import { useStore } from "@/lib/store";

export default function CartPage() {
  const { cart, updateCartQty, removeCartItem } = useStore();

  const itemsCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleQtyChange = (index, value) => {
    const qty = Math.max(1, Number(value) || 1);
    updateCartQty(index, qty);
  };

  return (
    <main className="page">
      <section className="cart-page">
        <div className="section-header">
          <h2>Your Cart</h2>
        </div>
        {cart.length === 0 ? (
          <div className="empty-state">
            <p>Your cart is empty. Start adding some cool outfits!</p>
            <Link href="/products" className="btn primary">
              Shop Now
            </Link>
          </div>
        ) : (
          <>
            <table className="cart-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Size</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Subtotal</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item, index) => {
                  const subtotal = item.price * item.qty;
                  return (
                    <tr key={index}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          {item.image && (
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={60}
                              height={60}
                              style={{
                                objectFit: 'cover',
                                borderRadius: '0.5rem',
                                border: '1px solid var(--border-subtle)'
                              }}
                            />
                          )}
                          <span>{item.name}</span>
                        </div>
                      </td>
                      <td>{item.size}</td>
                      <td>
                        <input
                          type="number"
                          min={1}
                          value={item.qty}
                          className="qty-input"
                          onChange={(e) =>
                            handleQtyChange(index, e.target.value)
                          }
                        />
                      </td>
                      <td>₹{item.price}</td>
                      <td>₹{subtotal}</td>
                      <td>
                        <button
                          className="remove-btn"
                          onClick={() => removeCartItem(index)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="cart-summary">
              <p>Items: {itemsCount}</p>
              <p>
                Total: ₹<span>{total}</span>
              </p>
              <Link href="/checkout" className="btn primary">
                Proceed to Checkout
              </Link>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
