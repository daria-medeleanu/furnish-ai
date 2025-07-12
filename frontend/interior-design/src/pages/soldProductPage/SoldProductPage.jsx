import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from '../../components/navbar/Navbar';
import Cookies from 'js-cookie';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import '../productPage/productPage.css';

const SoldProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentImg, setCurrentImg] = useState(0);
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [maximizedImg, setMaximizedImg] = useState(null);
  const [deliveryProvider, setDeliveryProvider] = useState('');
  const [deliveryStatus, setDeliveryStatus] = useState('');
  const [deliveryLoading, setDeliveryLoading] = useState(false);
  const [deliveryError, setDeliveryError] = useState('');
  const [deliverySuccess, setDeliverySuccess] = useState('');
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate('/home');
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = Cookies.get('token');
        const userId = Cookies.get('userID');
        setUserId(userId);
        const response = await fetch(`http://localhost:5029/api/v1/OrderedProducts/${id}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        if (!response.ok) {
          setError('Product not found or error fetching product.');
          setLoading(false);
          return;
        }
        const data = await response.json();
        console.log(data);
        setProduct(data);
        setName(data.user.name);
        setSurname(data.user.surname);
        setProfilePicture(data.user.imageUrl);
        setPhoneNumber(data.user.phone);
        setCity(data.user.city);
        setCountry(data.user.country);
      } catch (err) {
        console.log(err);
        setError('Network error.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const images = product?.imageUrls || (product?.img ? [product.img] : []);
  const hasImages = images && images.length > 0;

  const prevImg = () => setCurrentImg((prev) => (prev - 1 + images.length) % images.length);
  const nextImg = () => setCurrentImg((prev) => (prev + 1) % images.length);

  const handleStartDelivery = async () => {
    setDeliveryLoading(true);
    setDeliveryError('');
    setDeliverySuccess('');
    try {
      const token = Cookies.get('token');
      const orderId = product?.orderId || product?.id; 
      const response = await fetch(`http://localhost:5029/api/v1/Order/${orderId}/start-delivery`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(deliveryProvider)
      });
      if (response.ok) {
        setDeliverySuccess('Delivery started successfully!');
        setDeliveryStatus('Delivery Started');
      } else {
        const err = await response.json();
        setDeliveryError(err?.[0]?.description || 'Failed to start delivery.');
      }
    } catch (err) {
      setDeliveryError('Network error.');
    }
    setDeliveryLoading(false);
  };

  const handleMarkAsDelivered = async () => {
    setDeliveryLoading(true);
    setDeliveryError('');
    setDeliverySuccess('');
    try {
      const token = Cookies.get('token');
      const orderId = product?.orderId || product?.id; 
      const response = await fetch(`http://localhost:5029/api/v1/Order/${orderId}/mark-delivered`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        setDeliverySuccess('Marked as delivered!');
        setDeliveryStatus('Delivered');
      } else {
        const err = await response.json();
        setDeliveryError(err?.[0]?.description || 'Failed to mark as delivered.');
      }
    } catch (err) {
      setDeliveryError('Network error.');
    }
    setDeliveryLoading(false);
  };

  if (loading) return (
    <div className="product-page-wrapper">
      <Navbar page={"home"}/>
      <div className="loading-container">Loading...</div>
    </div>
  );

  if (error) return (
    <div className="product-page-wrapper">
      <Navbar page={"home"}/>
      <div className="error-container">{error}</div>
    </div>
  );

  if (!product) return null;

  return (
    <>
      <Navbar page={"home"}/>
      <div className="product-page-wrapper">
        <div className="product-page">
          <div className="left-side">
            <button
              className="back-to-prev-btn-product-page"
              onClick={handleBackToHome}
            >
              ← Back to home
            </button>
          </div>
          <div className="product-page-content-wrapper">
            <div className="product-page-content">
              <div className="product-header">
                <h1 className="product-title">{product.title || 'Product'}</h1>
                {product.category && (
                  <p className="product-subtitle">
                    Category: {typeof product.category === 'object' ? product.category.title : product.category}
                  </p>
                )}
              </div>
              <div className="product-main-content">
                <div className="images-wrapper">
                  <div className="product-images-section">
                    {hasImages ? (
                      <>
                        <div className="main-image-container">
                          <img
                            src={images[currentImg]}
                            alt={product.title}
                            className="main-image"
                            onClick={() => setMaximizedImg(images[currentImg])}
                            style={{cursor: 'zoom-in'}}
                          />
                          {images.length > 1 && (
                            <>
                              <button
                                onClick={prevImg}
                                className="nav-button prev"
                                aria-label="Previous image"
                              >
                                &#8249;
                              </button>
                              <button
                                onClick={nextImg}
                                className="nav-button next"
                                aria-label="Next image"
                              >
                                &#8250;
                              </button>
                              <div className="image-counter">
                                {currentImg + 1} / {images.length}
                              </div>
                            </>
                          )}
                        </div>
                        {images.length && (
                          <div className="image-thumbnails">
                            {images.map((img, index) => (
                              <div
                                key={index}
                                className={`thumbnail ${index === currentImg ? 'active' : ''}`}
                                onClick={() => setCurrentImg(index)}
                              >
                                <img
                                  src={img}
                                  alt={`${product.title} ${index + 1}`}
                                  onClick={e => {
                                    e.stopPropagation();
                                    setMaximizedImg(img);
                                  }}
                                  style={{cursor: 'zoom-in'}}
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="no-images-placeholder">
                        <p>📷 No images available for this product</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="product-details-section">
                  <div className="product-info-grid">
                    <div className="seller-info-wrapper">
                      {name && surname && (
                        <div className="info-card">
                          <div className="info-label">Seller</div>
                          <div className="info-value seller">
                            {profilePicture && (
                              <img
                                src={profilePicture}
                                alt="Profile"
                                className="profile-picture"
                              />
                            )}
                            {(profilePicture === "") && (
                              <AccountCircleIcon style={{width: 60, height: 60}}/>
                            )}
                            <p>{name} {surname}</p>
                            <p>reviews</p>
                            {phoneNumber && (
                              <p>{phoneNumber}</p>
                            )}
                            {city && country && (
                              <p>{city}, {country}</p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="general-info">
                      {product.condition && (
                        <div className="info-card">
                          <div className="info-label">Condition</div>
                          <div className="info-value">
                            {typeof product.condition === 'object' ? product.condition.title || JSON.stringify(product.condition) : product.condition}
                          </div>
                        </div>
                      )}
                      {product.price && (
                        <div className="info-card price-card">
                          <div className="info-label">Price</div>
                          <div className="info-value">
                            {product.price}{product.currency}
                          </div>
                        </div>
                      )}
                    </div>
                    {product.location && (
                      <div className="info-card">
                        <div className="info-label">Location</div>
                        <div className="info-value">
                          {typeof product.location === 'object' ? product.location.name || product.location.title || JSON.stringify(product.location) : product.location}
                        </div>
                      </div>
                    )}
                  </div>
                  {/* Delivery Buttons */}
                  <div className="delivery-section" style={{marginTop: '2rem'}}>
                    <h3>Delivery Actions</h3>
                    <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
                      <input
                        type="text"
                        placeholder="Delivery Provider"
                        value={deliveryProvider}
                        onChange={e => setDeliveryProvider(e.target.value)}
                        style={{padding: '0.5rem', borderRadius: 4, border: '1px solid #ccc'}}
                        disabled={deliveryLoading}
                      />
                      <button
                        className="delivery-btn"
                        onClick={handleStartDelivery}
                        disabled={deliveryLoading || !deliveryProvider}
                      >
                        {deliveryLoading ? 'Starting...' : 'Start Delivery'}
                      </button>
                      <button
                        className="delivery-btn"
                        onClick={handleMarkAsDelivered}
                        disabled={deliveryLoading}
                      >
                        {deliveryLoading ? 'Marking...' : 'Mark as Delivered'}
                      </button>
                    </div>
                    {deliveryError && <div style={{color: 'red', marginTop: 8}}>{deliveryError}</div>}
                    {deliverySuccess && <div style={{color: 'green', marginTop: 8}}>{deliverySuccess}</div>}
                    {deliveryStatus && <div style={{color: '#485c11', marginTop: 8}}>{deliveryStatus}</div>}
                  </div>
                </div>
              </div>
              {product.description && (
                <div className="product-description">
                  <h3>Description</h3>
                  <div
                    className="description-html"
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {maximizedImg && (
        <div
          className="maximized-image-modal"
          onClick={() => setMaximizedImg(null)}
        >
          {images.length > 1 && (
            <button
              className="maximized-nav-btn prev"
              onClick={e => {
                e.stopPropagation();
                const currentIndex = images.indexOf(maximizedImg);
                const prevIndex = (currentIndex - 1 + images.length) % images.length;
                setMaximizedImg(images[prevIndex]);
              }}
              aria-label="Previous image"
            >
              &#8249;
            </button>
          )}
          <img
            src={maximizedImg}
            alt="Maximized"
            className="img-product-page"
            onClick={e => e.stopPropagation()}
          />
          {images.length > 1 && (
            <button
              className="maximized-nav-btn next"
              onClick={e => {
                e.stopPropagation();
                const currentIndex = images.indexOf(maximizedImg);
                const nextIndex = (currentIndex + 1) % images.length;
                setMaximizedImg(images[nextIndex]);
              }}
              aria-label="Next image"
            >
              &#8250;
            </button>
          )}
          <button
            onClick={() => setMaximizedImg(null)}
            className="close-product-page"
            aria-label="Close"
          >
            ×
          </button>
        </div>
      )}
    </>
  );
};

export default SoldProductPage;