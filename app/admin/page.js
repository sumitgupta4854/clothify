"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";

const tabs = ["overview", "products", "orders", "users"];

export default function AdminPage() {
  const {
    products,
    orders,
    user,
    revenue,
    addProduct,
    deleteProduct,
    deleteOrder,
    updateOrderStatus,
  } = useStore();
  const [activeTab, setActiveTab] = useState("overview");

  const [newProd, setNewProd] = useState({
    name: "",
    category: "Men",
    price: "",
    mrp: "",
    rating: 4.5,
    sizes: "S,M,L,XL",
    tag: "New",
    image: "",
    quantity: 10,
  });

  const [imageFile, setImageFile] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleViewOrderDetails = (order) => {
    setSelectedOrder(order);
  };

  const closeModal = () => {
    setSelectedOrder(null);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setNewProd({
      name: product.name,
      category: product.category,
      price: product.price,
      mrp: product.mrp,
      rating: product.rating,
      sizes: product.sizes.join(","),
      tag: product.tag,
      image: product.image,
      quantity: product.quantity,
    });
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setEditingProduct(null);
    setShowEditModal(false);
    setNewProd({
      name: "",
      category: "Men",
      price: "",
      mrp: "",
      rating: 4.5,
      sizes: "S,M,L,XL",
      tag: "New",
      image: "",
      quantity: 10,
    });
    setImageFile(null);
  };


  const handleProdChange = (e) => {
    const { name, value } = e.target;
    setNewProd((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewProd((prev) => ({ ...prev, image: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProduct = (e) => {
    e.preventDefault();
    if (!editingProduct) return;
    if (!newProd.name || !newProd.price || !newProd.mrp) {
      alert("Please fill in all required fields (Name, Price, MRP)");
      return;
    }
    const payload = {
      name: newProd.name,
      category: newProd.category,
      price: Number(newProd.price),
      mrp: Number(newProd.mrp),
      rating: Number(newProd.rating),
      sizes: newProd.sizes
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      tag: newProd.tag || "New",
      image: newProd.image || "",
      quantity: Number(newProd.quantity) || 10,
    };
    // For simplicity, delete and add new (since no update function)
    deleteProduct(editingProduct.id);
    addProduct(payload);
    setEditingProduct(null);
    setShowEditModal(false);
    setNewProd({
      name: "",
      category: "Men",
      price: "",
      mrp: "",
      rating: 4.5,
      sizes: "S,M,L,XL",
      tag: "New",
      image: "",
      quantity: 10,
    });
    setImageFile(null);
    alert("Product updated successfully");
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newProd.name || !newProd.price || !newProd.mrp) {
      alert("Please fill in all required fields (Name, Price, MRP)");
      return;
    }
    const payload = {
      name: newProd.name,
      category: newProd.category,
      price: Number(newProd.price),
      mrp: Number(newProd.mrp),
      rating: Number(newProd.rating),
      sizes: newProd.sizes
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      tag: newProd.tag || "New",
      image: newProd.image || "",
      quantity: Number(newProd.quantity) || 10,
    };
    addProduct(payload);
    setShowEditModal(false);
    setNewProd({
      name: "",
      category: "Men",
      price: "",
      mrp: "",
      rating: 4.5,
      sizes: "S,M,L,XL",
      tag: "New",
      image: "",
      quantity: 10,
    });
    setImageFile(null);
    alert("Product added successfully");
  };

  return (
    <main className="page admin-page">
      <section className="admin-layout">
        <aside className="admin-sidebar">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={
                activeTab === tab ? "admin-tab active" : "admin-tab"
              }
              onClick={() => setActiveTab(tab)}
            >
              {tab[0].toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </aside>

        <section className="admin-content">
          {activeTab === "overview" && (
            <div className="admin-section">
              <h2>Overview</h2>
              <div className="admin-grid">
                <div className="admin-card">
                  <h3>Total Products</h3>
                  <p className="admin-metric">{products.length}</p>
                  <p className="muted">All active catalog items.</p>
                </div>
                <div className="admin-card">
                  <h3>Total Orders</h3>
                  <p className="admin-metric">{orders.length}</p>
                  <p className="muted">Across all time.</p>
                </div>
                <div className="admin-card">
                  <h3>Revenue (Demo)</h3>
                  <p className="admin-metric">₹{revenue}</p>
                  <p className="muted">Sum of all order totals.</p>
                </div>
                <div className="admin-card">
                  <h3>Registered Users</h3>
                  <p className="admin-metric">{user ? 1 : 0}</p>
                  <p className="muted">From front-end demo auth.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "products" && (
            <div className="admin-section">
              <h2>Product Management</h2>
              <p className="muted">
                Manage your product catalog. Changes are saved in browser localStorage.
              </p>
              <div className="product-management-layout">
                <div className="products-table-container">
                  <div className="table-header">
                    <h3>Existing Products</h3>
                    <button className="btn primary" onClick={() => setShowEditModal(true)}>
                      Add New Product
                    </button>
                  </div>
                  <div className="table-wrapper">
                    <table className="products-table">
                      <thead className="table-header-fixed">
                        <tr>
                          <th>Name</th>
                          <th>Category</th>
                          <th>Price</th>
                          <th>MRP</th>
                          <th>Rating</th>
                          <th>Quantity</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((p, index) => (
                          <tr key={p.id} className={index % 2 === 0 ? "even-row" : "odd-row"}>
                            <td>
                              <div className="product-name-cell">
                                <span>{p.name}</span>
                                {p.tag === "New" && <span className="badge-new">New</span>}
                              </div>
                            </td>
                            <td>{p.category}</td>
                            <td>₹{p.price}</td>
                            <td>₹{p.mrp}</td>
                            <td>{p.rating}</td>
                            <td>{p.quantity}</td>
                            <td>
                              <div className="action-buttons">
                                <button
                                  className="btn ghost small"
                                  onClick={() => handleEditProduct(p)}
                                >
                                  Edit
                                </button>
                                <button
                                  className="btn danger small"
                                  onClick={() => deleteProduct(p.id)}
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "orders" && (
            <div className="admin-section">
              <h2>Order Management</h2>
              <p className="muted">
                Update order status. This also reflects in customer "My Orders" page.
              </p>
              {!orders.length ? (
                <p className="muted empty-text">No orders yet.</p>
              ) : (
                <div className="products-table-container">
                  <div className="table-wrapper">
                    <table className="products-table">
                      <thead className="table-header-fixed">
                        <tr>
                          <th>Customer</th>
                          <th>Date</th>
                          <th>Items</th>
                          <th>Total</th>
                          <th>Status</th>
                          <th>Details</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order, idx) => {
                          const itemsCount = order.items.reduce(
                            (sum, i) => sum + i.qty,
                            0
                          );
                          return (
                            <tr key={order.id} className={`${idx % 2 === 0 ? "even-row" : "odd-row"} ${order.status === "Delivered" ? "delivered-row" : order.status === "Rejected" ? "rejected-row" : ""}`}>
                              <td>{order.address?.fullName || 'N/A'}</td>
                              <td>{order.date}</td>
                              <td>{itemsCount} item(s)</td>
                              <td>₹{order.total}</td>
                              <td>
                                <select
                                  value={order.status}
                                  onChange={(e) =>
                                    updateOrderStatus(idx, e.target.value)
                                  }
                                  className="status-select"
                                >
                                  <option value="placed">Placed</option>
                                  <option value="packed">Packed</option>
                                  <option value="shipped">Shipped</option>
                                  <option value="out_for_delivery">Out for Delivery</option>
                                  <option value="delivered">Delivered</option>
                                </select>
                              </td>
                              <td>
                                <button
                                  className="btn ghost small"
                                  onClick={() => handleViewOrderDetails(order)}
                                >
                                  See Details
                                </button>
                              </td>
                              <td>
                                <button
                                  className="btn danger small"
                                  onClick={() => deleteOrder(idx)}
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "users" && (
            <div className="admin-section">
              <h2>Users</h2>
              <p className="muted">
                Simple user list based on front-end demo auth.
              </p>
              {!user ? (
                <p className="muted empty-text">No users registered yet.</p>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                    </tr>
                  </tbody>
                </table>
              )}
            </div>
          )}
        </section>
      </section>

      {selectedOrder && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Order Details</h3>
            <div className="order-summary">
              <p><strong>Order ID:</strong> {selectedOrder.id}</p>
              <p><strong>Date:</strong> {selectedOrder.date}</p>
              <p><strong>Status:</strong> {selectedOrder.status}</p>
              <p><strong>Total:</strong> ₹{selectedOrder.total}</p>
            </div>
            <div className="customer-details">
              <h4>Customer Details</h4>
              <p><strong>Name:</strong> {selectedOrder.address?.fullName || 'N/A'}</p>
              <p><strong>Phone:</strong> {selectedOrder.address?.mobile || 'N/A'}</p>
              <p><strong>Address:</strong> {selectedOrder.address?.address || 'N/A'}, {selectedOrder.address?.city || 'N/A'}, {selectedOrder.address?.pincode || 'N/A'}</p>
            </div>
            <div className="order-items">
              <h4>Items Ordered</h4>
              <ul>
                {selectedOrder.items.map((item, idx) => {
                  const product = products.find(p => p.id === item.id);
                  return (
                    <li key={idx} className="order-item">
                      {product?.image && <img src={product.image} alt={item.name} className="order-item-image" />}
                      <div className="order-item-details">
                        {item.name} ({item.size}) - Qty: {item.qty} - ₹{item.price * item.qty}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
            <button className="btn primary" onClick={closeModal}>Close</button>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="edit-modal-overlay" onClick={closeEditModal}>
          <div className="edit-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingProduct ? "Edit Product" : "Add New Product"}</h3>
              <button className="close-btn" onClick={closeEditModal}>×</button>
            </div>
            <form className="edit-form" onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}>
              <div className="form-grid">
                <label>
                  Name
                  <input
                    type="text"
                    name="name"
                    value={newProd.name}
                    onChange={handleProdChange}
                    required
                  />
                </label>
                <label>
                  Category
                  <select
                    name="category"
                    value={newProd.category}
                    onChange={handleProdChange}
                  >
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Kids">Kids</option>
                    <option value="Winter">Winter</option>
                  </select>
                </label>
                <label>
                  Price (₹)
                  <input
                    type="number"
                    name="price"
                    value={newProd.price}
                    onChange={handleProdChange}
                    required
                  />
                </label>
                <label>
                  MRP (₹)
                  <input
                    type="number"
                    name="mrp"
                    value={newProd.mrp}
                    onChange={handleProdChange}
                    required
                  />
                </label>
                <label>
                  Rating (0–5)
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    name="rating"
                    value={newProd.rating}
                    onChange={handleProdChange}
                    required
                  />
                </label>
                <label>
                  Quantity
                  <input
                    type="number"
                    name="quantity"
                    value={newProd.quantity}
                    onChange={handleProdChange}
                    min="0"
                    required
                  />
                </label>
              </div>
              <label>
                Sizes (comma separated)
                <input
                  type="text"
                  name="sizes"
                  value={newProd.sizes}
                  onChange={handleProdChange}
                  required
                />
              </label>
              <label>
                Tag
                <input
                  type="text"
                  name="tag"
                  value={newProd.tag}
                  onChange={handleProdChange}
                />
              </label>
              <label>
                Product Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
              <div className="form-actions">
                <button type="submit" className="btn primary">
                  {editingProduct ? "Update Product" : "Add Product"}
                </button>
                <button type="button" className="btn ghost" onClick={closeEditModal}>
                  Cancel
                </button>
              </div>
            </form>
            <p className="muted small-note">
              Note: This is a front-end only admin. Data is stored in your browser (localStorage) only.
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
