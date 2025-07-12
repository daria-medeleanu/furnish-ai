import './favoritesPage.css'
import Navbar from '../../components/navbar/Navbar';
import LoadingSpinner from '../../components/loader/Loader';
import { useLocation, useNavigate } from 'react-router-dom';
import CardComponent from '../../components/card/Card';

const FavoritesPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const products = location.state?.products || [];
    console.log(products);
    
    return (
        <div className="favorites">
            <Navbar page={"home"} rightButtonMessage={"nothing"}/>
                <div className="favorite-title">Your favorites list</div>
                {products.length === 0 ? (
                    <div>No favorite products.</div>
                ) : (
                    <div className="card-wrapper-favorite">
                        {products.map((product, idx) => (
                            <div className="favorites-list" style={{ position: 'relative', marginBottom: '20px', width: '60%', display: 'flex', justifyContent: 'center' }}>
                                <div className="condition-badge" >
                                    {product.product.condition}
                                </div>
                                <CardComponent
                                    key={product.id || idx}
                                    title={product.product.title}
                                    price={product.product.price}
                                    currency={product.product.currency}
                                    condition={product.product.condition}
                                    imageUrls={product.product.imageUrls || [product.product.imageUrl]}
                                    productId={product.product.id}
                                    isFavorite={true}
                                    onClick={() => navigate(`/product/${product.product.id}`)}
                                />
                            </div>
                        ))}
                    </div>
                )}
        </div>
    )
}

export default FavoritesPage;
