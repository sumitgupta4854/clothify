"use client";

import { useStore } from "../../../lib/store";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const categories = ['All', 'Men', 'Women', 'Kids', 'Winter', 'Accessories'];

export default function AdminProductsPage() {
  const { products, user, addProduct, deleteProduct, updateProductQuantity, updateProduct } = useStore();
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Men',
    price: '',
    mrp: '',
    rating: 4.0,
    sizes: '',
    tag: '',
    image: '',
    quantity: 10
  });

  const fileInputRef = useRef();
  const editFileInputRef = useRef();


  const filteredProducts = products.filter(product => {
    const matchesCategory = categoryFilter === 'All' || product.category === categoryFilter;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.image) {
      alert('Please fill in all required fields');
      return;
    }

    const productData = {
      ...newProduct,
      price: parseFloat(newProduct.price),
      mrp: parseFloat(newProduct.mrp) || parseFloat(newProduct.price),
      sizes: newProduct.sizes ? newProduct.sizes.split(',').map(s => s.trim()) : [],
      quantity: parseInt(newProduct.quantity) || 10
    };

    addProduct(productData);
    setNewProduct({
      name: '',
      category: 'Men',
      price: '',
      mrp: '',
      rating: 4.0,
      sizes: '',
      tag: '',
      image: '',
      quantity: 10
    });
    fileInputRef.current.value = '';
    setShowAddProduct(false);
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    updateProductQuantity(productId, parseInt(newQuantity));
  };

  if (!user) {
    return (
      <div className="page">
        <div className="auth-card" style={{ maxWidth: "400px", margin: "2rem auto" }}>
          <h1>Admin Access Required</h1>
          <p>Please login as admin to access this page.</p>
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
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <Link href="/admin" style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: '1.2rem' }}>
              ← Back to Dashboard
            </Link>
          </div>
          <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem', fontWeight: '700', color: 'var(--text)' }}>
            Product Management
          </h1>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '1rem' }}>
            Manage your clothing inventory and products
          </p>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <div>
            <label style={{ marginRight: '0.5rem', fontWeight: '500' }}>Category:</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              style={{ padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid var(--border)', background: 'var(--bg-surface)', color: 'var(--text)' }}
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div style={{ flex: 1, minWidth: '200px' }}>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '0.5rem',
                border: '1px solid var(--border)',
                background: 'var(--bg-surface)',
                color: 'var(--text)'
              }}
            />
          </div>

          <button
            onClick={() => setShowAddProduct(true)}
            className="btn primary"
            style={{ padding: '0.5rem 1rem' }}
          >
            + Add Product
          </button>
        </div>

        {/* Products Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '1.5rem'
        }}>
          {filteredProducts.map(product => (
            <div key={product.id} style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <img
                  src={product.image}
                  alt={product.name}
                  style={{ width: '80px', height: '80px', borderRadius: '8px', objectFit: 'cover' }}
                />
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', color: 'var(--text)' }}>
                    {product.name}
                  </h3>
                  <p style={{ margin: '0 0 0.5rem 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    {product.category} • {product.tag}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text)' }}>
                      ₹{product.price}
                    </span>
                    {product.mrp > product.price && (
                      <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                        ₹{product.mrp}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginRight: '0.5rem' }}>
                    Stock:
                  </label>
                  <input
                    type="number"
                    value={product.quantity}
                    onChange={(e) => handleUpdateQuantity(product.id, e.target.value)}
                    style={{
                      width: '60px',
                      padding: '0.25rem',
                      borderRadius: '4px',
                      border: '1px solid var(--border)',
                      background: 'var(--bg-surface)',
                      color: 'var(--text)',
                      textAlign: 'center'
                    }}
                  />
                </div>
                <div style={{
                  padding: '0.25rem 0.75rem',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  background: product.quantity === 0 ? 'rgba(239, 68, 68, 0.1)' :
                             product.quantity <= 3 ? 'rgba(251, 191, 36, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                  color: product.quantity === 0 ? '#ef4444' :
                         product.quantity <= 3 ? '#f59e0b' : '#10b981',
                  border: `1px solid ${product.quantity === 0 ? 'rgba(239, 68, 68, 0.3)' :
                                       product.quantity <= 3 ? 'rgba(251, 191, 36, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`
                }}>
                  {product.quantity === 0 ? 'Out of Stock' :
                   product.quantity <= 3 ? 'Low Stock' : 'In Stock'}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => setEditingProduct(product)}
                  className="btn secondary"
                  style={{ flex: 1, padding: '0.5rem' }}
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this product?')) {
                      deleteProduct(product.id);
                    }
                  }}
                  className="btn danger"
                  style={{ flex: 1, padding: '0.5rem' }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="empty-state">
            <h3>No products found</h3>
            <p>No products match your current filters.</p>
          </div>
        )}

        {/* Add Product Modal */}
        {showAddProduct && (
          <div className="modal-overlay" onClick={() => setShowAddProduct(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
              <div className="modal-header">
                <h3>Add New Product</h3>
                <button onClick={() => setShowAddProduct(false)} className="close-btn">×</button>
              </div>

              <div className="edit-form">
                <div className="form-grid" style={{ gridTemplateColumns: '1fr' }}>
                  <div>
                    <label>Product Name *</label>
                    <input
                      type="text"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                      placeholder="Enter product name"
                    />
                  </div>

                  <div>
                    <label>Category</label>
                    <select
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                    >
                      <option value="Men">Men</option>
                      <option value="Women">Women</option>
                      <option value="Kids">Kids</option>
                      <option value="Winter">Winter</option>
                      <option value="Accessories">Accessories</option>
                    </select>
                  </div>

                  <div>
                    <label>Price *</label>
                    <input
                      type="number"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                      placeholder="Enter price"
                    />
                  </div>

                  <div>
                    <label>MRP (Optional)</label>
                    <input
                      type="number"
                      value={newProduct.mrp}
                      onChange={(e) => setNewProduct({...newProduct, mrp: e.target.value})}
                      placeholder="Enter MRP"
                    />
                  </div>

                  <div>
                    <label>Sizes (comma separated)</label>
                    <input
                      type="text"
                      value={newProduct.sizes}
                      onChange={(e) => setNewProduct({...newProduct, sizes: e.target.value})}
                      placeholder="S, M, L, XL"
                    />
                  </div>

                  <div>
                    <label>Tag</label>
                    <input
                      type="text"
                      value={newProduct.tag}
                      onChange={(e) => setNewProduct({...newProduct, tag: e.target.value})}
                      placeholder="Bestseller, New, etc."
                    />
                  </div>

                  <div>
                    <label>Image File</label>
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const formData = new FormData();
                          formData.append('file', file);
                          try {
                            const response = await fetch('/api/upload-image', {
                              method: 'POST',
                              body: formData,
                            });
                            const data = await response.json();
                            if (data.url) {
                              setNewProduct({...newProduct, image: data.url});
                            } else {
                              alert('Upload failed: ' + (data.error || 'Unknown error'));
                            }
                          } catch (error) {
                            alert('Upload failed: ' + error.message);
                          }
                        }
                      }}
                    />
                  </div>

                  <div>
                    <label>Or Image URL *</label>
                    <input
                      type="url"
                      value={newProduct.image}
                      onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                      placeholder="https://..."
                    />
                  </div>

                  <div>
                    <label>Initial Quantity</label>
                    <input
                      type="number"
                      value={newProduct.quantity}
                      onChange={(e) => setNewProduct({...newProduct, quantity: e.target.value})}
                      placeholder="10"
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button onClick={() => setShowAddProduct(false)} className="btn secondary">
                    Cancel
                  </button>
                  <button onClick={handleAddProduct} className="btn primary">
                    Add Product
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Product Modal */}
        {editingProduct && (
          <div className="modal-overlay" onClick={() => setEditingProduct(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
              <div className="modal-header">
                <h3>Edit Product</h3>
                <button onClick={() => setEditingProduct(null)} className="close-btn">×</button>
              </div>

              <div className="edit-form">
                <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
                  <img
                    src={editingProduct.image}
                    alt={editingProduct.name}
                    style={{ width: '100px', height: '100px', borderRadius: '8px', objectFit: 'cover' }}
                  />
                </div>

                <div className="form-grid">
                  <div>
                    <label>Product Name</label>
                    <input
                      type="text"
                      value={editingProduct.name}
                      onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                    />
                  </div>

                  <div>
                    <label>Category</label>
                    <select
                      value={editingProduct.category}
                      onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})}
                    >
                      <option value="Men">Men</option>
                      <option value="Women">Women</option>
                      <option value="Kids">Kids</option>
                      <option value="Winter">Winter</option>
                      <option value="Accessories">Accessories</option>
                    </select>
                  </div>

                  <div>
                    <label>Price</label>
                    <input
                      type="number"
                      value={editingProduct.price}
                      onChange={(e) => setEditingProduct({...editingProduct, price: e.target.value})}
                    />
                  </div>

                  <div>
                    <label>MRP</label>
                    <input
                      type="number"
                      value={editingProduct.mrp}
                      onChange={(e) => setEditingProduct({...editingProduct, mrp: e.target.value})}
                    />
                  </div>

                  <div>
                    <label>Sizes</label>
                    <input
                      type="text"
                      value={editingProduct.sizes?.join(', ') || ''}
                      onChange={(e) => setEditingProduct({...editingProduct, sizes: e.target.value.split(',').map(s => s.trim())})}
                    />
                  </div>

                  <div>
                    <label>Tag</label>
                    <input
                      type="text"
                      value={editingProduct.tag}
                      onChange={(e) => setEditingProduct({...editingProduct, tag: e.target.value})}
                    />
                  </div>

                  <div>
                    <label>Image File</label>
                    <input
                      type="file"
                      accept="image/*"
                      ref={editFileInputRef}
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const formData = new FormData();
                          formData.append('file', file);
                          try {
                            const response = await fetch('/api/upload-image', {
                              method: 'POST',
                              body: formData,
                            });
                            const data = await response.json();
                            if (data.url) {
                              setEditingProduct({...editingProduct, image: data.url});
                            } else {
                              alert('Upload failed: ' + (data.error || 'Unknown error'));
                            }
                          } catch (error) {
                            alert('Upload failed: ' + error.message);
                          }
                        }
                      }}
                    />
                  </div>

                  <div>
                    <label>Or Image URL</label>
                    <input
                      type="url"
                      value={editingProduct.image}
                      onChange={(e) => setEditingProduct({...editingProduct, image: e.target.value})}
                    />
                  </div>

                  <div>
                    <label>Quantity</label>
                    <input
                      type="number"
                      value={editingProduct.quantity}
                      onChange={(e) => setEditingProduct({...editingProduct, quantity: e.target.value})}
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button onClick={() => setEditingProduct(null)} className="btn secondary">
                    Cancel
                  </button>
                  <button onClick={() => {
                    updateProduct(editingProduct.id, editingProduct);
                    setEditingProduct(null);
                  }} className="btn primary">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
