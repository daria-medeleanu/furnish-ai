import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import Navbar from '../../components/navbar/Navbar';
import './orderProductPage.css';

const OrderProductPage = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [product, setProduct] = useState(location.state?.product || null);
    const [address, setAddress] = useState('');
    const [note, setNote] = useState('');
    const [success, setSuccess] = useState(false);

    const handleCancelOrder = async () => {
        const token = Cookies.get('token');
        try {
            const response = await fetch(`http://localhost:5029/api/v1/Orders/${orderId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    status: "Cancelled"
                })
            });
            if (response.ok) {
                alert('Order cancelled.');
            } else {
                alert('Failed to cancel order.');
            }
        } catch (err) {
            alert('Failed to cancel order.');
        }
    };

    useEffect(() => {
    if (!product) {
      navigate('/home');
    }
  }, [product, navigate]);
  
    const handleOrder = async (e) => {
        e.preventDefault();
        setSuccess(false);

        const token = Cookies.get('token');
        const userId = Cookies.get('userID');

        try {
            console.log(product);
            const response = await fetch('http://localhost:5029/api/v1/Orders/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    clientId: userId,
                    sellerId: product.user.ownerId,
                    productId: product.id,
                    price: product.price,
                    currency: product.currency,
                    address: address,
                })
            });

            if (response.ok) {
                const orderId  = await response.json();
                navigate(`/profile`, { state: { successMessage: "Order placed successfully!" } });
            } else {
                const err = await response.json();
                alert(err?.[0]?.description || 'Failed to place order.');
            }
        } catch (err) {
            alert('Failed to place order.');
        }
    };

    if (!product) return null;

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <>
            <Navbar page="home" />
            <div className="order-product-page-wrapper">
                <div className="order-product-page">
                    <div className="left-side-order">
                        <button
                            className="back-to-prev-btn-product-page"
                            onClick={handleBack}
                        >
                            ← Back to product
                        </button>
                    </div>
                    <div className="order-product-card">
                        <div className="right-side">

                            <h2>Order Summary</h2>
                            <div className="order-product-info">
                                <div>
                                    <div className='order-title'><strong>{product.title}</strong></div>
                                    <p>Price: {product.price} {product.currency}</p>
                                    <p>Seller: {product.user?.name} {product.user?.surname}</p>
                                </div>
                                <img
                                    src={product.imageUrls?.[0] || product.img}
                                    alt={product.title}
                                    className="order-product-img"
                                />
                            </div>
                            <form className="order-form" onSubmit={handleOrder}>
                                <label>
                                    Delivery Address:
                                    <input
                                        type="text"
                                        value={address}
                                        onChange={e => setAddress(e.target.value)}
                                        required
                                    />
                                </label>
                                <button type="submit" className="order-submit-btn">
                                    Place Order
                                </button>
                            </form>
                        </div>
                        {success && <div className="order-success-msg">Order placed successfully!</div>}
                    </div>
                </div>
            </div>
        </>
    );
};

export default OrderProductPage;