import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Navbar from '../../components/navbar/Navbar'
import Cookies from 'js-cookie';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import './productPage.css'

const ProductPage = () => {
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
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerPrice, setOfferPrice] = useState('');
  const [offerMessage, setOfferMessage] = useState('');
  const [offerLoading, setOfferLoading] = useState(false);
  const [offerSuccess, setOfferSuccess] = useState('');
  const [offerError, setOfferError] = useState('');
  const [userHasOffer, setUserHasOffer] = useState(false);
  const [offersMade, setOffersMade] = useState([]);
  const [allOffers, setAllOffers] = useState([]);
  const [isOwner, setIsOwner] = useState(false);
  const [ownerId, setOwnerId] = useState("");
  const [offersLoading, setOffersLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate('/home');
  };
  
  const handleFavoriteToggle = async (e) => {
    e.stopPropagation();
    setIsFavorite(fav => !fav);

    const token = Cookies.get('token');
    const userId = Cookies.get('userID');

    try{
      await fetch('http://localhost:5029/api/v1/Favorites/toggle', {
        method: 'POST',
        headers: {
          'Content-Type' : 'application/json',
          'Authorization' : `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: userId,
          productId: id
        })
      });
    } catch (err) {
      setIsFavorite(fav => !fav);
      console.error('Failed to toggle favorite:', err);
    }
  };

  const handleMakeOffer = async () => {
    setOfferLoading(true);
    setOfferError('');
    setOfferSuccess('');
    try {
      const token = Cookies.get('token');
      const userId = Cookies.get('userID');
      const buyerName = sessionStorage.getItem('userName');
      const buyerSurname = sessionStorage.getItem('userSurname');
      console.log('Name', buyerName);
      const response = await fetch('http://localhost:5029/api/v1/Offer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          buyerId: userId,
          buyerName: `${buyerName} ${buyerSurname}`,
          productId: product.id,
          offeredPrice: offerPrice,
          currency: product.currency,
          message: offerMessage
        })
      });
      if (response.ok) {
        console.log(response);
        setOfferSuccess('Offer sent successfully!');
        setShowOfferModal(false);
        setOfferPrice('');
        setOfferMessage('');
        setUserHasOffer(true);
      } else {
        const err = await response.json();
        setOfferError(err?.[0]?.description || 'Failed to send offer.');
      }
    } catch (err) {
      setOfferError('Network error.');
    }
    setOfferLoading(false);
  };

  const fetchAllOffers = async () => {
    setOffersLoading(true);
    try {
      const token = Cookies.get('token');
      const userId = Cookies.get('userID');
      const offersRes = await fetch(
        `http://localhost:5029/api/v1/Offer/product/${product.id}/seller/${userId}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      if (offersRes.ok) {
        const offersData = await offersRes.json();
        console.log(offersData);
        setAllOffers(offersData);
      } else {
        setAllOffers([]);
      }
    } catch (err) {
      setAllOffers([]);
    }
    setOffersLoading(false);
  };

  useEffect(() => { 
    const fetchProduct = async () => {
      try {
        const token = Cookies.get('token');
        const userId = Cookies.get('userID');
        setUserId(userId);
        const response = await fetch(`http://localhost:5029/api/v1/Products/${id}`,
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
        console.log('data', data);
        setProduct(data);
        setName(data.user.name);
        setSurname(data.user.surname);
        setProfilePicture(data.user.imageUrl);
        setPhoneNumber(data.user.phone);
        setCity(data.user.city);
        setCountry(data.user.country);
        setIsFavorite(data.isFavorite);
        console.log('ownerid', data.user.id);
        setOwnerId(data.user.id);
        if(userId && userId === data.user.id){
          setIsOwner(true);
          const offersRes = await fetch(
            `http://localhost:5029/api/v1/Offer/product/${id}/seller/${userId}`,
            {headers: {'Authorization': `Bearer ${token}`}}
          );
          if(offersRes.ok) {
            const offersData = await offersRes.json();
            // console.log(offersData);
            setAllOffers(offersData);
          }
          else {
            console.log('There was an error fetching offers for this product')
          }
        } else {
          const offersRes = await fetch(`http://localhost:5029/api/v1/Offer/user/${userId}`,
            {headers: {'Authorization': `Bearer ${token}` } }
          );

          if(offersRes.ok){
            const offersData = await offersRes.json();
            setOffersMade(offersData);
            const hasOffer = (offersData).some(offer => offer.productId === data.id);
            setUserHasOffer(hasOffer);
          }
        }
      } catch (err) {
        console.log('Network error.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
    
  }, [id]);
  
  const handleAcceptOffer = async (offerId) => {
    const token = Cookies.get('token');
    try{
      const res = await fetch(`http://localhost:5029/api/v1/Offer/${offerId}/accept`,{
        method: 'PUT',
        headers: {'Authorization': `Bearer ${token}`}
      });
      if(res.ok){
        setAllOffers(prev => 
          prev.map(o => o.id === offerId ? { ...o, status: 'Accepted'} : o)
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleRejectOffer = async (offerId) => {
    const token = Cookies.get('token');
    try {
      const res = await fetch(`http://localhost:5029/api/v1/Offer/${offerId}/reject`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setAllOffers(prev =>
          prev.map(o => o.id === offerId ? { ...o, status: 'Rejected' } : o)
        );
      }
    } catch (err) {
      console.log(err);
    }
  }

  const handleDeleteOffer = async (offerId) => {
    const token = Cookies.get('token');
    try {
      const res = await fetch(`http://localhost:5029/api/v1/Offer/${offerId}/delete`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setAllOffers(prev =>
          prev.filter(o => o.id !== offerId)
        );
      }
    } catch (err) {
      console.log(err);
    }
  }

  const handleOfferButtonClick = () => {
    if (isOwner) {
      fetchAllOffers();
      setShowOfferModal(true);
    } else if (userHasOffer) {

      const fetchUserOffers = async () => {
        setOffersLoading(true);
        try {
          const token = Cookies.get('token');
          const userId = Cookies.get('userID');
          const offersRes = await fetch(
            `http://localhost:5029/api/v1/Offer/user/${userId}`,
            { headers: { 'Authorization': `Bearer ${token}` } }
          );
          if (offersRes.ok) {
            const offersData = await offersRes.json();
            const filtered = (offersData.value || offersData).filter(
              offer => offer.productId === product.id
            );
            setOffersMade(filtered);
          } else {
            setOffersMade([]);
          }
        } catch (err) {
          setOffersMade([]);
        }
        setOffersLoading(false);
        setShowOfferModal(true);
      };
      fetchUserOffers();
    } else {
      setShowOfferModal(true);
    }
  };
  
  const hasOnlyRejectedOffers = () => {
    if (!offersMade || !Array.isArray(offersMade)) return false;
    const thisProductOffers = offersMade.filter(offer => offer.productId === product.id);
    return thisProductOffers.length > 0 && thisProductOffers.every(offer => offer.status === "Rejected");
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

  const images = product.imageUrls || (product.img ? [product.img] : []);
  const hasImages = images && images.length > 0;

  const prevImg = () => setCurrentImg((prev) => (prev - 1 + images.length) % images.length);
  const nextImg = () => setCurrentImg((prev) => (prev + 1) % images.length);
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
                <div className="direction-column">
                  <h1 className="product-title">{product.title || 'Product'}</h1>
                  {product.category && (
                    <p className="product-subtitle">
                      Category: {typeof product.category === 'object' ? product.category.title : product.category}
                    </p>
                  )}
                </div>
                <div className="favorite-button-wrapper">
                  <div
                    className={`favorite-button-product ${isFavorite ? 'favorited' : ''}`}
                    onClick={handleFavoriteToggle}
                  >
                    {isFavorite ? <FavoriteIcon sx={{ color: '#e53935' }}/> : <FavoriteBorderIcon sx={{ color: '#485c11' }}/>}
                  </div>
                </div>
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
                            {(profilePicture=="") && (
                              
                                <AccountCircleIcon style={{width: 60, height: 60}}/>
                            )}
                            <Link 
                              to={`/seller/${product.user.id}`}
                              state={{
                                seller: {
                                  id: product.user.id,
                                  name: product.user.name,
                                  surname: product.user.surname,
                                  email: product.user.email,
                                  imageUrl: product.user.imageUrl,
                                  phone: product.user.phone,
                                  city: product.user.city,
                                  country: product.user.country,
                                }
                              }}  
                            >
                              <p>{name} {surname}</p>
                            </Link>
                            {phoneNumber && (
                              <p>{phoneNumber}</p>
                            )}
                            {city && country &&(
                              <p>{city}, {country}</p>
                            )}
                          </div>
                          <button
                            className="contact-seller-btn"
                            onClick={handleOfferButtonClick}
                          >
                            {isOwner && "See Offers"}
                            {(userHasOffer && !isOwner) && "Offer already sent!"}
                            {(!userHasOffer && !isOwner) && "Make Offer"}
                            
                          </button>
                          {!isOwner && (
                            
                            <button
                              className="order-product-btn"
                              
                              onClick={() => navigate(`/order/${id}`, {
                                state: {
                                  product: {
                                    id: product.id,
                                    title: product.title,
                                    price: product.price,
                                    currency: product.currency,
                                    imageUrls: product.imageUrls || (product.img ? [product.img] : []),
                                    user: {
                                      ownerId,
                                      name,
                                      surname,
                                      phone: phoneNumber,
                                      imageUrl: profilePicture
                                    }
                                  }
                                }
                              })}
                            >
                              Order this product
                            </button>
                          )}
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
                            {product.price }{product.currency}
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
      
      {showOfferModal && (
        isOwner ? (
          <div className="offer-modal">
            <div className="offer-modal-content">
              <h4>Offers for your product:</h4>
              <h4>You can accept as many offers as you want, the one who orders first will get the product</h4>
              {offersLoading ? (
                <div>Loading offers...</div>
              ) : (
                <div className="all-offers-wrapper">
                  {allOffers.length === 0 && <li>No offers yet.</li>}
                  {allOffers.map((offer, idx) => (
                    <div key={offer.id || idx} className={`offer-item-wrapper ${offer.status === "Pending" ? "pending" : offer.status === "Accepted" ? "accepted" : "rejected"}`}>
                      <div className="offer-item">
                        <div>
                          <strong>Buyer:</strong>
                          <Link to={`/profile/${offer.buyerId}`} className="buyer-link">
                            {offer.buyerName || offer.buyerId}
                          </Link>
                        </div>
                        <div><strong>Offered Price:</strong> {offer.offeredPrice}{offer.currency}</div>
                        <div><strong>Status:</strong> {offer.status}</div>
                        {offer.status === "Pending" && (
                          <div className="accept-reject-buttons">
                            <CheckCircleIcon
                              className="offer-action-icon"
                              style={{ color: '#43a047', cursor: 'pointer' }}
                              onClick={() => handleAcceptOffer(offer.id)}
                              titleAccess="Accept"
                            />
                            <CancelIcon
                              className="offer-action-icon"
                              style={{ color: '#e53935', cursor: 'pointer' }}
                              onClick={() => handleRejectOffer(offer.id)}
                              titleAccess="Reject"
                            />
                            <DeleteIcon
                              className="offer-action-icon"
                              style={{ color: '#888', cursor: 'pointer' }}
                              onClick={() => handleDeleteOffer(offer.id)}
                              titleAccess="Delete"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <button className="offer-button" onClick={() => setShowOfferModal(false)}>Close</button>
            </div>
          </div>
        ) : (
        !userHasOffer ? (
          <div className="offer-modal">
            <div className="offer-modal-content">
              <h3>Make an Offer</h3>
              <label className="label-offer">
                Price:
                <div className="row-direction">
                  <div>
                    <input
                      type="number"
                      value={offerPrice}
                      onChange={e => setOfferPrice(e.target.value)}
                      min={`${product.price}`}
                      className="input-set-new-offer"
                    />
                  </div>
                  <div className="currency">
                    {product.currency}
                  </div>
                </div>
              </label>
              {offerError && <div className="error-message">{offerError}</div>}
              {/* {offerSuccess && <div className="success-message">{offerSuccess}</div>} */}
              <button className="offer-button" onClick={handleMakeOffer} disabled={offerLoading}>
                {offerLoading ? ('Sending...') : ( <strong>Send Offer</strong>)}
              </button>
              <button className="offer-button" onClick={() => setShowOfferModal(false)}><strong>Cancel</strong></button>
            </div>
          </div>
        ): 
        (
        <div className="offers-made-wrapper">
          <div className="offers-made-content">
            <h4>Your Offers:</h4>
            <div>
              {(offersMade.value || offersMade).map((offer, idx) => (
                <div
                  key={offer.id || idx}
                  className={`user-offer-item-wrapper ${offer.status === "Pending" ? "pending" : offer.status === "Accepted" ? "accepted" : "rejected"}`}
                >
                  <div className="user-offer-item">
                    <div className="user-offer-field"><strong>Offered Price:</strong> {offer.offeredPrice}{offer.currency}</div>
                    <div className="user-offer-field"><strong>Status:</strong> {offer.status}</div>
                    {offer.status === "Accepted" && (
                      <button
                        className="order-negociated-price"
                        onClick={() => navigate(`/order/${product.id}`, {
                          state: {
                            product: {
                              id: product.id,
                              title: product.title,
                              price: offer.offeredPrice,
                              currency: offer.currency,
                              imageUrls: product.imageUrls,
                              user: {
                                ownerId,
                                name,
                                surname,
                                phone: phoneNumber,
                                imageUrl: profilePicture
                              }
                            }
                          }
                        })}
                      >
                        <strong>Order at negotiated price</strong>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {hasOnlyRejectedOffers() && (
              <div className="new-offer-section">
                <h4>Make a New Offer:</h4>
                <label className="label-offer">
                  Price:
                  <div className="row-direction">
                    <input
                      type="number"
                      value={offerPrice}
                      onChange={e => setOfferPrice(e.target.value)}
                      min={`${product.price}`}
                    />
                    <div className="currency">
                      {product.currency}
                    </div>
                  </div>
                </label>
                {offerError && <div className="error-message">{offerError}</div>}
                {offerSuccess && <div className="success-message">{offerSuccess}</div>}
                <button className="offer-button" onClick={handleMakeOffer} disabled={offerLoading}>
                  {offerLoading ? 'Sending...' : <strong>Send New Offer</strong>}
                </button>
              </div>
            )}
            
            <button className="offer-button" onClick={() => setShowOfferModal(false)}>Cancel</button>
          </div>
        </div>
        )
      )
      )}
    </>
  );
}

export default ProductPage;
