import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import Navbar from '../../components/navbar/Navbar';

const PayOrderPage = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [cardName, setCardName] = useState('');

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

  const handlePay = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const response = await fetch(`http://localhost:5029/api/v1/Orders/${id}/simulate-payment`, {
        method: 'POST'
      });
      if (response.ok) {
        alert('Payment successful!');
        window.location.reload();
      } else {
        alert('Payment failed.');
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
      <div className="pay-order-wrapper" style={{ maxWidth: 700, margin: '40px auto', background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', padding: 32 }}>
        <h2>Order Payment</h2>
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
            <form onSubmit={handlePay} style={{ maxWidth: 350, margin: '0 auto', textAlign: 'left' }}>
              <div style={{ marginBottom: 12 }}>
                <label>Cardholder Name<br />
                  <input
                    type="text"
                    value={cardName}
                    onChange={e => setCardName(e.target.value)}
                    required
                    style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
                  />
                </label>
              </div>
              <div style={{ marginBottom: 12 }}>
                <label>Card Number<br />
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={e => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                    required
                    pattern="\d{16}"
                    placeholder="1234 5678 9012 3456"
                    style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
                  />
                </label>
              </div>
              <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                <label style={{ flex: 1 }}>Expiry<br />
                  <input
                    type="text"
                    value={expiry}
                    onChange={e => setExpiry(e.target.value.replace(/[^0-9/]/g, '').slice(0, 5))}
                    required
                    placeholder="MM/YY"
                    pattern="\d{2}/\d{2}"
                    style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
                  />
                </label>
                <label style={{ flex: 1 }}>CVC<br />
                  <input
                    type="text"
                    value={cvc}
                    onChange={e => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    required
                    pattern="\d{3,4}"
                    placeholder="123"
                    style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
                  />
                </label>
              </div>
              <button type="submit" disabled={actionLoading} className="order-action-btn" style={{ width: '100%' }}>
                {actionLoading ? 'Processing...' : 'Pay Now'}
              </button>
            </form>
          )}
          {order.status === "Paid" && (
            <span style={{ color: 'green', fontWeight: 600 }}>Paid. Delivery in progress.</span>
          )}
          {order.status === "Cancelled" && (
            <span style={{ color: 'red', fontWeight: 600 }}>Order Cancelled</span>
          )}
        </div>
        <button style={{ marginTop: 32 }} onClick={() => navigate('/orders')}>Back to Orders</button>
      </div>
    </>
  );
};

export default PayOrderPage;