"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { DEFAULT_PRODUCTS } from "./data";

const STORAGE_KEYS = {
  CART: "clothify_cart",
  USER: "clothify_user",
  ORDERS: "clothify_orders",
  PRODUCTS: "clothify_products",
};

function safeGet(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function safeSet(key, value) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [products, setProducts] = useState(DEFAULT_PRODUCTS);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // const storedProducts = safeGet(STORAGE_KEYS.PRODUCTS, []);
    // if (storedProducts.length) {
    //   setProducts(storedProducts);
    // }

    setCart(safeGet(STORAGE_KEYS.CART, []));
    setOrders(safeGet(STORAGE_KEYS.ORDERS, []));
    setUser(safeGet(STORAGE_KEYS.USER, null));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    safeSet(STORAGE_KEYS.PRODUCTS, products);
  }, [products, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    safeSet(STORAGE_KEYS.CART, cart);
  }, [cart, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    safeSet(STORAGE_KEYS.ORDERS, orders);
  }, [orders, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    safeSet(STORAGE_KEYS.USER, user);
  }, [user, hydrated]);

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  function addToCart(productId, size, qty = 1) {
    if (!size) {
      alert("Please select a size");
      return;
    }
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    if (product.quantity < qty) {
      alert("Insufficient stock");
      return;
    }
    setCart((prev) => {
      const existing = prev.find((i) => i.id === productId && i.size === size);
      if (existing) {
        if (existing.qty + qty > product.quantity) {
          alert("Insufficient stock for additional quantity");
          return prev;
        }
        return prev.map((i) =>
          i.id === productId && i.size === size ? { ...i, qty: i.qty + qty } : i
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          size,
          qty,
          category: product.category,
          image: product.image,
        },
      ];
    });
    setToastMessage("Item added to cart!");
    setTimeout(() => setToastMessage(null), 3000); // Hide after 3 seconds
  }

  function updateCartQty(index, qty) {
    setCart((prev) =>
      prev.map((item, i) => (i === index ? { ...item, qty } : item))
    );
  }

  function removeCartItem(index) {
    setCart((prev) => prev.filter((_, i) => i !== index));
  }

  function clearCart() {
    setCart([]);
  }

  function placeOrder(addressPayload) {
    if (!cart.length) {
      alert("Cart is empty");
      return null;
    }
    // Check stock before placing order
    for (const item of cart) {
      const product = products.find(p => p.id === item.id);
      if (!product || product.quantity < item.qty) {
        alert(`Insufficient stock for ${item.name}`);
        return null;
      }
    }
    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const order = {
      id: "OD" + Date.now(),
      items: cart,
      total,
      date: new Date().toLocaleString(),
      status: "placed",
      address: addressPayload,
    };
    setOrders((prev) => [...prev, order]);
    // Reduce quantities
    setProducts((prev) =>
      prev.map((p) => {
        const cartItem = cart.find((c) => c.id === p.id);
        if (cartItem) {
          return { ...p, quantity: p.quantity - cartItem.qty };
        }
        return p;
      })
    );
    clearCart();
    return order;
  }

  function updateOrderStatus(idx, status) {
    setOrders((prev) =>
      prev.map((o, i) => (i === idx ? { ...o, status } : o))
    );
  }

  function addProduct(payload) {
    const newProduct = {
      id: "p" + Date.now(),
      quantity: payload.quantity || 10,
      ...payload,
    };
    setProducts((prev) => [...prev, newProduct]);
  }

  function deleteProduct(id) {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  function deleteOrder(idx) {
    setOrders((prev) => prev.filter((_, i) => i !== idx));
  }

  function updateProductQuantity(id, newQuantity) {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, quantity: newQuantity } : p))
    );
  }

  function register(userPayload) {
    setUser(userPayload);
  }

  function login(email) {
    const name = email.split("@")[0];
    setUser({ name, email });
  }

  function logout() {
    setUser(null);
  }

  const revenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);

  const value = {
    hydrated,
    products,
    cart,
    cartCount,
    orders,
    user,
    toastMessage,
    revenue,
    addToCart,
    updateCartQty,
    removeCartItem,
    clearCart,
    placeOrder,
    addProduct,
    deleteProduct,
    deleteOrder,
    updateOrderStatus,
    updateProductQuantity,
    register,
    login,
    logout,
    setToastMessage,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
