"use client";

import { useStore } from "../../../lib/store";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminOffersPage() {
  const { products, user } = useStore();
  const [offers, setOffers] = useState([]);
  const [showCreateOffer, setShowCreateOffer] = useState(false);
  const [newOffer, setNewOffer] = useState({
    title: '',
    description: '',
    discountType: 'percentage', // 'percentage' or 'fixed'
    discountValue: '',
    applicableProducts: [],
    startDate: '',
    endDate: '',
    isActive: true
  });

  useEffect(() => {
    // Load offers from localStorage or initialize empty
    const savedOffers = localStorage.getItem('clothify_offers');
    if (savedOffers) {
      setOffers(JSON.parse(savedOffers));
    }
  }, []);

  useEffect(() => {
    // Save offers to localStorage
    localStorage.setItem('clothify_offers', JSON.stringify(offers));
  }, [offers]);

  const handleCreateOffer = () => {
    if (!newOffer.title || !newOffer.discountValue) {
      alert('Please fill in all required fields');
      return;
    }

    const offer = {
      id: 'offer_' + Date.now(),
      ...newOffer,
      discountValue: parseFloat(newOffer.discountValue),
      createdAt: new Date().toISOString()
    };

    setOffers([...offers, offer]);
    setNewOffer({
      title: '',
      description: '',
      discountType: 'percentage',
      discountValue: '',
      applicableProducts: [],
      startDate: '',
      endDate: '',
      isActive: true
    });
    setShowCreateOffer(false);
  };

  const toggleOfferStatus = (offerId) => {
    setOffers(offers.map(offer =>
      offer.id === offerId ? { ...offer, isActive: !offer.isActive } : offer
    ));
  };

  const deleteOffer = (offerId) => {
    if (confirm('Are you sure you want to delete this offer?')) {
      setOffers(offers.filter(offer => offer.id !== offerId));
    }
  };

  const getApplicableProducts = (offer) => {
    if (offer.applicableProducts.length === 0) return products;
    return products.filter(product => offer.applicableProducts.includes(product.id));
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
            Offers & Promotions
          </h1>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '1rem' }}>
            Create and manage promotional offers for your products
          </p>
        </div>

        {/* Create Offer Button */}
        <div style={{ marginBottom: '2rem' }}>
          <button
            onClick={() => setShowCreateOffer(true)}
            className="btn primary"
            style={{ padding: '0.75rem 1.5rem', fontSize: '1rem' }}
          >
            + Create New Offer
          </button>
        </div>

        {/* Offers List */}
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {offers.map(offer => (
            <div key={offer.id} style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
              opacity: offer.isActive ? 1 : 0.6
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', color: 'var(--text)' }}>
                    {offer.title}
                  </h3>
                  <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    {offer.description}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    background: offer.isActive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(156, 163, 175, 0.1)',
                    color: offer.isActive ? '#10b981' : '#6b7280',
                    border: `1px solid ${offer.isActive ? 'rgba(16, 185, 129, 0.3)' : 'rgba(156, 163, 175, 0.3)'}`
                  }}>
                    {offer.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Discount:</span>
                  <div style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--text)' }}>
                    {offer.discountType === 'percentage' ? `${offer.discountValue}% off` : `₹${offer.discountValue} off`}
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Duration:</span>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text)' }}>
                    {offer.startDate ? new Date(offer.startDate).toLocaleDateString() : 'No start date'} -
                    {offer.endDate ? new Date(offer.endDate).toLocaleDateString() : 'No end date'}
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Applicable Products:</span>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text)' }}>
                    {offer.applicableProducts.length === 0 ? 'All Products' : `${offer.applicableProducts.length} products`}
                  </div>
                </div>
              </div>

              {/* Applicable Products Preview */}
              {offer.applicableProducts.length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>
                    Applicable Products:
                  </span>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {getApplicableProducts(offer).slice(0, 5).map(product => (
                      <div key={product.id} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        background: 'var(--bg-elevated)',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        color: 'var(--text)'
                      }}>
                        <img
                          src={product.image}
                          alt={product.name}
                          style={{ width: '20px', height: '20px', borderRadius: '4px', objectFit: 'cover' }}
                        />
                        {product.name}
                      </div>
                    ))}
                    {getApplicableProducts(offer).length > 5 && (
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        +{getApplicableProducts(offer).length - 5} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => toggleOfferStatus(offer.id)}
                  className={`btn ${offer.isActive ? 'secondary' : 'success'}`}
                  style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                >
                  {offer.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  onClick={() => deleteOffer(offer.id)}
                  className="btn danger"
                  style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {offers.length === 0 && (
          <div className="empty-state" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎯</div>
            <h3>No offers created yet</h3>
            <p>Create your first promotional offer to boost sales!</p>
          </div>
        )}

        {/* Create Offer Modal */}
        {showCreateOffer && (
          <div className="modal-overlay" onClick={() => setShowCreateOffer(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
              <div className="modal-header">
                <h3>Create New Offer</h3>
                <button onClick={() => setShowCreateOffer(false)} className="close-btn">×</button>
              </div>

              <div className="edit-form">
                <div className="form-grid">
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label>Offer Title *</label>
                    <input
                      type="text"
                      value={newOffer.title}
                      onChange={(e) => setNewOffer({...newOffer, title: e.target.value})}
                      placeholder="e.g., Summer Sale, Festival Offer"
                    />
                  </div>

                  <div style={{ gridColumn: '1 / -1' }}>
                    <label>Description</label>
                    <textarea
                      value={newOffer.description}
                      onChange={(e) => setNewOffer({...newOffer, description: e.target.value})}
                      placeholder="Describe the offer..."
                      rows="3"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: '0.5rem',
                        border: '1px solid rgba(63, 63, 70, 0.4)',
                        background: 'rgba(26, 26, 26, 0.95)',
                        color: 'var(--text)',
                        resize: 'vertical'
                      }}
                    />
                  </div>

                  <div>
                    <label>Discount Type</label>
                    <select
                      value={newOffer.discountType}
                      onChange={(e) => setNewOffer({...newOffer, discountType: e.target.value})}
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount (₹)</option>
                    </select>
                  </div>

                  <div>
                    <label>Discount Value *</label>
                    <input
                      type="number"
                      value={newOffer.discountValue}
                      onChange={(e) => setNewOffer({...newOffer, discountValue: e.target.value})}
                      placeholder={newOffer.discountType === 'percentage' ? '10' : '100'}
                      min="0"
                    />
                  </div>

                  <div>
                    <label>Start Date</label>
                    <input
                      type="date"
                      value={newOffer.startDate}
                      onChange={(e) => setNewOffer({...newOffer, startDate: e.target.value})}
                    />
                  </div>

                  <div>
                    <label>End Date</label>
                    <input
                      type="date"
                      value={newOffer.endDate}
                      onChange={(e) => setNewOffer({...newOffer, endDate: e.target.value})}
                    />
                  </div>
                </div>

                <div style={{ marginTop: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>
                    Applicable Products (leave empty for all products)
                  </label>
                  <div style={{
                    maxHeight: '200px',
                    overflowY: 'auto',
                    border: '1px solid var(--border)',
                    borderRadius: '0.5rem',
                    padding: '0.5rem',
                    background: 'var(--bg-surface)'
                  }}>
                    {products.map(product => (
                      <label key={product.id} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.25rem',
                        cursor: 'pointer',
                        borderRadius: '4px',
                        marginBottom: '0.25rem'
                      }}>
                        <input
                          type="checkbox"
                          checked={newOffer.applicableProducts.includes(product.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewOffer({
                                ...newOffer,
                                applicableProducts: [...newOffer.applicableProducts, product.id]
                              });
                            } else {
                              setNewOffer({
                                ...newOffer,
                                applicableProducts: newOffer.applicableProducts.filter(id => id !== product.id)
                              });
                            }
                          }}
                        />
                        <img
                          src={product.image}
                          alt={product.name}
                          style={{ width: '30px', height: '30px', borderRadius: '4px', objectFit: 'cover' }}
                        />
                        <span style={{ fontSize: '0.9rem', color: 'var(--text)' }}>{product.name}</span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>₹{product.price}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-actions">
                  <button onClick={() => setShowCreateOffer(false)} className="btn secondary">
                    Cancel
                  </button>
                  <button onClick={handleCreateOffer} className="btn primary">
                    Create Offer
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
