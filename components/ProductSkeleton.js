export default function ProductSkeleton() {
  return (
    <article className="product-card skeleton">
      <div className="product-image-container">
        <div className="product-image skeleton-shimmer"></div>
      </div>
      <div className="product-info">
        <div className="skeleton-text skeleton-shimmer" style={{ height: '12px', width: '60%', marginBottom: '8px' }}></div>
        <div className="skeleton-text skeleton-shimmer" style={{ height: '16px', width: '90%', marginBottom: '8px' }}></div>
        <div className="skeleton-text skeleton-shimmer" style={{ height: '14px', width: '40%', marginBottom: '12px' }}></div>
        <div className="skeleton-text skeleton-shimmer" style={{ height: '18px', width: '50%' }}></div>
      </div>
      <div className="card-footer">
        <div className="skeleton-text skeleton-shimmer" style={{ height: '32px', width: '100%', marginBottom: '8px' }}></div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <div className="skeleton-text skeleton-shimmer" style={{ height: '36px', flex: 1 }}></div>
          <div className="skeleton-text skeleton-shimmer" style={{ height: '36px', flex: 1 }}></div>
        </div>
      </div>
    </article>
  );
}