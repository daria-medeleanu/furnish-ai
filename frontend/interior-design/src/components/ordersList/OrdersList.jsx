import React, { useState } from 'react';
import './ordersList.css';
import { Link } from 'react-router-dom';

const OrdersList = ({ orders, history = false }) => {
  const [expandedOrders, setExpandedOrders] = useState(new Set());
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
  const toggleOrderDetails = (orderId) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  if (!orders || orders.length === 0) {
    return (
      <div className="orders-list-empty">
        <p>No {history ? 'order history' : 'active orders'} found.</p>
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

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  return (
    <div className="orders-list">
      {orders.map((order) => {
        const isExpanded = expandedOrders.has(order.id);
        return (
        <div key={order.id} className="order-item">
          <div className="order-header">
            <Link to="/product/${product.id}">
                <div className="order-id">
                <strong>Order #{order.productTitle}</strong>
                </div>
            </Link>
            <div className="order-header-right">
              <div 
                className="order-status"
                style={{ color: getStatusColor(order.status) }}
              >
                <strong>{order.orderStatus || 'Unknown'}</strong>
              </div>
              <button 
                className="expand-arrow"
                onClick={() => toggleOrderDetails(order.id)}
                aria-label={isExpanded ? "Collapse details" : "Expand details"}
              >
                <span className={`arrow ${isExpanded ? 'expanded' : ''}`}>▼</span>
              </button>
            </div>
          </div>
          
          {isExpanded && (
            <div className="order-details">
              <div className="order-info">
                <div className="order-date">
                  <span className="label">Date:</span>
                  <span>{formatDate(order.orderDate)}</span>
                </div>
                
                <div className="order-total">
                  <span className="label">Total:</span>
                  <span className="total-amount">
                    {order.price}{order.currency}
                  </span>
                </div>
                
                {order.address && (
                  <div className="order-address">
                    <span className="label">Shipping to:</span>
                    <span>{order.address}</span>
                  </div>
                )}
                
                {order.seller && (
                  <div className="order-address">
                      <span className="label">Seller:</span>
                      <span>{order.seller.name} {order.seller.surname}</span>
                  </div>
                  
                )}
                {order.seller && (
                  <div className="order-address">
                      <span className="label">Seller Phone Number:</span>
                      <span>{order.seller.phone}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {isExpanded && order.items && order.items.length > 0 && (
            <div className="order-items">
              <div className="items-header">Items ({order.items.length}):</div>
              <div className="items-list">
                {order.items.map((item, index) => (
                  <div key={index} className="order-item-detail">
                    {item.productImage && (
                      <img 
                        src={item.productImage} 
                        alt={item.productName || 'Product'} 
                        className="item-image"
                      />
                    )}
                    <div className="item-info">
                      <div className="item-name">
                        {item.productName || item.name || 'Unknown Product'}
                      </div>
                      <div className="item-details">
                        <span>Qty: {item.quantity || 1}</span>
                        {item.price && (
                          <span className="item-price">
                            {formatPrice(item.price)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!history && isExpanded && (
            <div className="order-actions">
              {order.status?.toLowerCase() === 'pending' && (
                <button className="btn-cancel-order">Cancel Order</button>
              )}
            </div>
          )}
        </div>
        )
      })}
    </div>
  );
};

export default OrdersList;
