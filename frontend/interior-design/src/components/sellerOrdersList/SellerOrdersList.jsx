import React, { useState } from 'react';
import {useNavigate} from 'react-router-dom';
import './sellerOrdersList.css';
import Cookies from 'js-cookie';

const SellerOrdersList = ({ orders, type = 'products', onOrderUpdate, onProductDelete }) => {
  const [expandedOrders, setExpandedOrders] = useState(new Set());
  const [actionLoading, setActionLoading] = useState({});
  const [actionError, setActionError] = useState({});
  const [actionSuccess, setActionSuccess] = useState({});
  const [showAllPopup, setShowAllPopup] = useState(false);
  const navigate = useNavigate();

  const toggleOrderDetails = (orderId) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  const setLoading = (orderId, isLoading) => {
    setActionLoading(prev => ({ ...prev, [orderId]: isLoading }));
  };

  const setError = (orderId, error) => {
    setActionError(prev => ({ ...prev, [orderId]: error }));
    setTimeout(() => {
      setActionError(prev => ({ ...prev, [orderId]: '' }));
    }, 5000);
  };

  const setSuccess = (orderId, message) => {
    setActionSuccess(prev => ({ ...prev, [orderId]: message }));
    setTimeout(() => {
      setActionSuccess(prev => ({ ...prev, [orderId]: '' }));
    }, 3000);
  };

  const handleStartDelivery = async (order) => {
    const orderId = order.id;
    setLoading(orderId, true);
    setError(orderId, '');
    setSuccess(orderId, '');

    try {
      const token = Cookies.get('token');
      const response = await fetch(`http://localhost:5029/api/v1/Orders/start-delivery/${orderId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setSuccess(orderId, 'Delivery started successfully!');
        if (onOrderUpdate) onOrderUpdate();
      } else {
        const err = await response.json();
        setError(orderId, err?.[0]?.description || 'Failed to start delivery.');
      }
    } catch (err) {
      setError(orderId, 'Network error.');
    }
    setLoading(orderId, false);
  };

  const handleMarkAsDelivered = async (order) => {
    const orderId = order.id;
    setLoading(orderId, true);
    setError(orderId, '');
    setSuccess(orderId, '');

    try {
      const token = Cookies.get('token');
      const response = await fetch(`http://localhost:5029/api/v1/Orders/mark-delivered/${orderId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setSuccess(orderId, 'Marked as delivered!');
        if (onOrderUpdate) onOrderUpdate();
      } else {
        const err = await response.json();
        setError(orderId, err?.[0]?.description || 'Failed to mark as delivered.');
      }
    } catch (err) {
      setError(orderId, 'Network error.');
    }
    setLoading(orderId, false);
  };

  const handleDeleteProduct = async (product) => {
    const productId = product.id;
    setLoading(productId, true);
    setError(productId, '');
    setSuccess(productId, '');

    try {
      const token = Cookies.get('token');
      const response = await fetch(`http://localhost:5029/api/v1/Products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setSuccess(productId, 'Product deleted!');
        if (onProductDelete) onProductDelete(productId);
      } else {
        const err = await response.json();
        setError(productId, err?.[0]?.description || 'Failed to delete product.');
      }
    } catch (err) {
      setError(productId, 'Network error.');
    }
    setLoading(productId, false);
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  if (!orders || orders.length === 0) {
    return (
      <div className="seller-orders-list-empty">
        <p>No {type} found.</p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return '#ff9800';
      case 'intransit':
        return '#2196f3';
      case 'delivered':
        return '#4caf50';
      default:
        return '#757575';
    }
  };

  return (
    <div className="seller-orders-list">
      {orders.slice(0, 5).map((order) => {
        const isExpanded = expandedOrders.has(order.id);
        const itemId = order.id;
        const isLoading = actionLoading[itemId];
        const error = actionError[itemId];
        const success = actionSuccess[itemId];

        return (
          <div key={order.id} className="seller-order-item">
            <div className="seller-order-header">
              <div className="seller-order-id">
                <strong>
                  {type === 'products' ? (
                    <span 
                      className="product-title-link"
                      onClick={() => handleProductClick(order.id)}
                      style={{ cursor: 'pointer', textDecoration: 'underline' }}
                    >
                      {order.title}
                    </span>
                  ) : (
                    `Order #${order.productTitle || order.id?.slice(-8)}`
                  )}
                </strong>
              </div>
              <div className="seller-order-header-right">
                <div 
                  className="seller-order-status"
                  style={{ color: getStatusColor(order.orderStatus || order.status) }}
                >
                  <strong>{order.orderStatus || order.status || 'Not yet ordered'}</strong>
                </div>
                <button 
                  className="seller-expand-arrow"
                  onClick={() => toggleOrderDetails(order.id)}
                  aria-label={isExpanded ? "Collapse details" : "Expand details"}
                >
                  <span className={`arrow ${isExpanded ? 'expanded' : ''}`}>▼</span>
                </button>
              </div>
            </div>
            
            {isExpanded && (
              <div className="seller-order-details">
                <div className="seller-order-info">
                  {/* <div className="seller-order-date">
                    <span className="label">Date:</span>
                    <span>{formatDate(order.orderDate || order.createdAt)}</span>
                  </div> */}
                  
                  <div className="seller-order-total">
                    <span className="label">Price:</span>
                    <span className="total-amount">
                      {order.price}{order.currency || '$'}
                    </span>
                  </div>
                  
                  {order.address && (
                    <div className="seller-order-address">
                      <span className="label">Shipping to:</span>
                      <span>{order.address}</span>
                    </div>
                  )}
                  
                  {order.client && (
                    <>
                      <div className="seller-order-buyer">
                        <span className="label">Client:</span>
                        <span>{order.client.name} {order.client.surname}</span>
                      </div>
                      <div className="seller-order-buyer-phone">
                        <span className="label">Client Phone:</span>
                        <span>{order.client.phone}</span>
                      </div>
                    </>
                  )}

                  {order.imageUrls && order.imageUrls.length > 0 && (
                    <div className="seller-product-image">
                      <img 
                        src={order.imageUrls[0]} 
                        alt={order.title || 'Product'} 
                        className="product-preview-image"
                      />
                    </div>
                  )}
                </div>

                <div className="seller-order-actions">
                  {type === 'orders' && order.orderStatus?.toLowerCase() === 'pending' && (
                    <button
                      className="btn-start-delivery"
                      onClick={() => handleStartDelivery(order)}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Starting...' : 'Start Delivery'}
                    </button>
                  )}

                  {type === 'orders' && order.orderStatus?.toLowerCase() === 'intransit' && (
                    <button
                      className="btn-mark-delivered"
                      onClick={() => handleMarkAsDelivered(order)}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Marking...' : 'Mark as Delivered'}
                    </button>
                  )}

                  {type === 'products' && (
                    <button
                      className="btn-delete-product"
                      onClick={() => handleDeleteProduct(order)}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Deleting...' : 'Delete Product'}
                    </button>
                  )}

                  {error && <div className="action-error">{error}</div>}
                  {success && <div className="action-success">{success}</div>}
                </div>
              </div>
            )}
          </div>
        );
      })}
      
      {orders.length > 5 && (
        <div className="see-all-container">
          <button 
            className="btn-see-all"
            onClick={() => setShowAllPopup(true)}
          >
            See All ({orders.length})
          </button>
        </div>
      )}

      {showAllPopup && (
        <div className="popup-overlay" onClick={() => setShowAllPopup(false)}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <div className="popup-header">
              <h3>All {type === 'products' ? 'Products' : type === 'orders' ? 'Orders' : 'Items'} ({orders.length})</h3>
              <button 
                className="popup-close"
                onClick={() => setShowAllPopup(false)}
                aria-label="Close popup"
              >
                ×
              </button>
            </div>
            <div className="popup-body">
              {orders.map((order) => {
                const isExpanded = expandedOrders.has(order.id);
                const itemId = order.id;
                const isLoading = actionLoading[itemId];
                const error = actionError[itemId];
                const success = actionSuccess[itemId];

                return (
                  <div key={order.id} className="seller-order-item popup-item">
                    <div className="seller-order-header">
                      <div className="seller-order-id">
                        <strong>
                          {type === 'products' ? (
                            order.isActive ? (
                              <span
                                className="product-title-link"
                                onClick={() => handleProductClick(order.id)}
                                style={{ cursor: 'pointer', textDecoration: 'underline' }}
                              >
                                {order.title}
                              </span>
                            ) : (
                              order.title
                            )
                          ) : (
                            `Order #${order.productTitle || order.id?.slice(-8)}`
                          )}
                        </strong>
                      </div>
                      <div className="seller-order-header-right">
                        <div 
                          className="seller-order-status"
                          style={{ color: getStatusColor(order.orderStatus || order.status) }}
                        >
                          <strong>{order.orderStatus || order.status || 'Not yet ordered'}</strong>
                        </div>
                        <button 
                          className="seller-expand-arrow"
                          onClick={() => toggleOrderDetails(order.id)}
                          aria-label={isExpanded ? "Collapse details" : "Expand details"}
                        >
                          <span className={`arrow ${isExpanded ? 'expanded' : ''}`}>▼</span>
                        </button>
                      </div>
                    </div>
                    
                    {isExpanded && (
                      <div className="seller-order-details">
                        <div className="seller-order-info">
                          { order.createdAt && (
                            <div className="seller-order-date">
                              <span className="label">Date:</span>
                              <span>{formatDate(order.orderDate || order.createdAt)}</span>
                            </div>
                          )}
                          
                          <div className="seller-order-total">
                            <span className="label">Price:</span>
                            <span className="total-amount">
                              {order.price}{order.currency || '$'}
                            </span>
                          </div>
                          
                          {order.address && (
                            <div className="seller-order-address">
                              <span className="label">Shipping to:</span>
                              <span>{order.address}</span>
                            </div>
                          )}
                          
                          {order.client && (
                            <>
                              <div className="seller-order-buyer">
                                <span className="label">Client:</span>
                                <span>{order.client.name} {order.client.surname}</span>
                              </div>
                              <div className="seller-order-buyer-phone">
                                <span className="label">Client Phone:</span>
                                <span>{order.client.phone}</span>
                              </div>
                            </>
                          )}

                          {order.imageUrls && order.imageUrls.length > 0 && (
                            <div className="seller-product-image">
                              <img 
                                src={order.imageUrls[0]} 
                                alt={order.title || 'Product'} 
                                className="product-preview-image"
                              />
                            </div>
                          )}
                        </div>

                        
                        <div className="seller-order-actions">
                          {type === 'orders' && order.orderStatus?.toLowerCase() === 'pending' && (
                            <button
                              className="btn-start-delivery"
                              onClick={() => handleStartDelivery(order)}
                              disabled={isLoading}
                            >
                              {isLoading ? 'Starting...' : 'Start Delivery'}
                            </button>
                          )}

                          {type === 'orders' && order.orderStatus?.toLowerCase() === 'intransit' && (
                            <button
                              className="btn-mark-delivered"
                              onClick={() => handleMarkAsDelivered(order)}
                              disabled={isLoading}
                            >
                              {isLoading ? 'Marking...' : 'Mark as Delivered'}
                            </button>
                          )}

                          {type === 'products' && (
                            <button
                              className="btn-delete-product"
                              onClick={() => handleDeleteProduct(order)}
                              disabled={isLoading}
                            >
                              {isLoading ? 'Deleting...' : 'Delete Product'}
                            </button>
                          )}

                          {error && <div className="action-error">{error}</div>}
                          {success && <div className="action-success">{success}</div>}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerOrdersList;
