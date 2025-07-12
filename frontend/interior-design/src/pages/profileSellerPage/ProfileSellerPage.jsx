import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import CardComponent from '../../components/card/Card';
import Cookies from 'js-cookie';
import Navbar from '../../components/navbar/Navbar';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import './profileSellerPage.css'; 
import '../profilePage/profile.css'

const ProfileSellerPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const location = useLocation();
  const { sellerId } = useParams();
  const [seller, setSeller] = useState(location.state?.seller || null);

  useEffect(() => {
    const token = Cookies.get('token');
    
    if(seller){
        setLoading(false);
        setError('');
    
        const fetchProducts = async () => {
            setLoading(true);
            setError('');
            try {
                const productsRes = await fetch(`http://localhost:5029/api/v1/Products/getbyuserid/${sellerId}`, {
                    headers: {'Authorization' : `Bearer ${token}` }
                });
        
                if (!productsRes.ok) throw new Error('Failed to fetch products');
                const productsData = await productsRes.json();
                setProducts((productsData.value || productsData).filter(p => p.isActive));
            } catch (err) {
            setError(err.message || 'Error loading seller products');
            } finally {
            setLoading(false);
            }
        };
        fetchProducts();
        return;
    }
    },[sellerId]);

  if (loading) return <div>Loading seller profile...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div className="profile-wrapper">
      <Navbar page="home" />
      <div className="profile">
        <div className="left-side">
            <button
            className="back-to-prev-btn-product-page"
            onClick={() => navigate(-1)}
            >
            ← Back
            </button>
        </div>
        
        <h2 className="profile-title">Seller Profile</h2>
        
        <div className="profile-info">
          <div className="profile-left-side">
            <div className="profile-image-section">
              {seller?.imageUrl ? (
                <img
                  src={seller.imageUrl}
                  alt="Profile"
                  className="profile-image"
                />
              ) : (
                <AccountCircleIcon style={{width: 200, height: 200}}/>
              )}
            </div>
          </div>
          
          {!seller ? (
            <div>Loading...</div>
          ) : (
            <div className="profile-info">
              <div className="profile-details-section">
                <div><strong>Name:</strong> {seller.name} {seller.surname}</div>
                <div><strong>Email:</strong> {seller.email}</div>
                {seller.phone && <div><strong>Phone:</strong> {seller.phone}</div>}
                {seller.country && <div><strong>Country:</strong> {seller.country}</div>}
                {seller.city && <div><strong>City:</strong> {seller.city}</div>}
              </div>
            </div>
          )}
        </div>

        <div className="profile-actions-section" style={{marginTop: '2rem'}}>
          <h3 className="profile-title">Products by {seller?.name}</h3>
          {products.length === 0 ? (
            <div>No products found for this seller.</div>
          ) : (
            <div className="products-sections-wrapper">
                <div className="products-section">
                    <div className="card-wrapper">
                    {products.map(product => (
                        <CardComponent
                        key={product.id}
                        title={product.title}
                        price={product.price}
                        currency={product.currency}
                        condition={product.condition}
                        description={product.description}
                        imageUrl={product.img || '/assets/canapea.jpg'}
                        imageUrls={product.imageUrls}
                        isFavorite={product.isFavorite}
                        onClick={() => window.location.href = `/product/${product.id}`}
                        productId={product.id}
                        />
                    ))}
                    </div>
                </div>
            </div>

          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileSellerPage;