import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import Navbar from '../../components/navbar/Navbar';

const OrderSummaryPage = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      setError('');
      try {
        const token = Cookies.get('token');
        const response = await fetch(`http://localhost:5029/api/v1/Orders/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) {
          setError('Order not found.');
          setLoading(false);
          return;
        }
        const data = await response.json();
        setOrder(data.value || data);
      } catch {
        setError('Error fetching order.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const handlePay = async () => {
    navigate(`/pay-order/${id}`);
  };

  const handleCancel = async () => {
    setActionLoading(true);
    try {
      const token = Cookies.get('token');
      const response = await fetch(`http://localhost:5029/api/v1/Orders/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: "Cancelled" })
      });
      if (response.ok) {
        alert('Order cancelled.');
        navigate('/orders');
      } else {
        alert('Failed to cancel order.');
      }
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!order) return null;

  return (
    <>
      <Navbar page="home" />
      <div className="order-summary-wrapper" style={{ maxWidth: 700, margin: '40px auto', background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', padding: 32 }}>
        <h2>Order Summary</h2>
        <div style={{ marginBottom: 20 }}>
          <strong>Product:</strong> {order.product?.title || '-'}<br />
          <strong>Price:</strong> {order.offerPrice} {order.product?.currency || ''}<br />
          <strong>Status:</strong> {order.status}<br />
          <strong>Order Date:</strong> {order.orderDate && new Date(order.orderDate).toLocaleString()}<br />
          <strong>Delivery Address:</strong> {order.address || '-'}
        </div>
        {order.product?.imageUrls && (
          <img src={order.product.imageUrls[0]} alt={order.product.title} style={{ width: 200, borderRadius: 12, marginBottom: 20 }} />
        )}
        <div style={{ marginTop: 24 }}>
          {order.status === "PendingPayment" && (
            <>
              <button onClick={handlePay} disabled={actionLoading} className="order-action-btn">Pay</button>
              <button onClick={handleCancel} disabled={actionLoading} className="order-action-btn" style={{ marginLeft: 16 }}>Cancel Order</button>
            </>
          )}
          {order.status === "Paid" && (
            <span style={{ color: 'green', fontWeight: 600 }}>Paid. Delivery in progress.</span>
          )}
          {order.status === "Cancelled" && (
            <span style={{ color: 'red', fontWeight: 600 }}>Order Cancelled</span>
          )}
        </div>
      </div>
    </>
  );
};

export default OrderSummaryPage;