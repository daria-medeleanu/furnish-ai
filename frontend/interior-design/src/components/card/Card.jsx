import './card.css'
import { useState } from 'react';
import AspectRatio from '@mui/joy/AspectRatio';
import Link from '@mui/joy/Link';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import Chip from '@mui/joy/Chip';
import Typography from '@mui/joy/Typography';
import IconButton from '@mui/joy/IconButton';
import Box from '@mui/joy/Box';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Cookies from 'js-cookie';

const CardComponent = ({ 
  title = "Product Title", 
  price = "0", 
  currency = "lei", 
  condition = "good", 
  description = "", 
  isFavorite = false,
  imageUrl = "/assets/canapea.jpg",
  imageUrls = [],
  productId,
  fromProfile=false,
  onClick 
}) => {
  const images = imageUrls && imageUrls.length > 0 ? imageUrls : [imageUrl];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [favorite, setFavorite] = useState(isFavorite);
  
  const formatPrice = (price, currency) => {
    if (currency === 'euro') 
      return `€${price}`;
    return `${price} ron`;
  };

  const handlePrevImage = (e) => {
    e.stopPropagation(); 
    setCurrentImageIndex((prev) => 
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const handleNextImage = (e) => {
    e.stopPropagation(); 
    setCurrentImageIndex((prev) => 
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const handleImageClick = (e) => {
    e.stopPropagation(); 
  };

  const handleFavoriteToggle = async (e) => {
    e.stopPropagation();
    setFavorite(fav => !fav);

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
          productId: productId
        })
      });
    } catch (err) {
      setFavorite(fav => !fav);
      console.error('Failed to toggle favorite:', err);
    }
  };

  return (
    <Card
      variant="outlined"
      orientation="horizontal"
      className="card-comp-wrapper"
      onClick={onClick}
    >
      {!fromProfile && (
        <IconButton
          onClick={handleFavoriteToggle}
          className='favorite-button'
          aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
        >
          {favorite ? (
            <FavoriteIcon sx={{ color: '#e53935' }} />
          ) : (
            <FavoriteBorderIcon sx={{ color: '#485c11' }} />
          )}
        </IconButton>
      )}
      <AspectRatio ratio="1" className="image-aspect-ratio">
        <img
          src={images[currentImageIndex]}
          srcSet={`${images[currentImageIndex]} 1x, ${images[currentImageIndex]} 2x`}
          loading="lazy"
          alt={`${title} - Image ${currentImageIndex + 1}`}
          className="image-cover"
        />
        
        {images.length > 1 && (
          <Box
            className="more-box"
            onClick={handleImageClick}
          >
            <IconButton
              size="sm"
              variant="solid"
              color="neutral"
              onClick={handlePrevImage}
              sx={{
                alignSelf: 'center',
                backgroundColor: '#5c7e64', 
                '&:hover': {
                  backgroundColor: '#5c7e64',
                },
                display:'flex',
                justifyContent:'center',
                alignItems:'center',
              }}
              className="more-box-arrow"
            >
              <ArrowBackIosIcon fontSize="small" />
            </IconButton>
            
            <IconButton
              size="sm"
              variant="solid"
              color="neutral"
              onClick={handleNextImage}
              className="more-box-arrow"
              sx={{
                backgroundColor: '#5c7e64', 
                '&:hover': {
                  backgroundColor: '#5c7e64',
                },
                display:'flex',
                justifyContent:'center',
              }}
            >
              <ArrowForwardIosIcon fontSize="small" />
            </IconButton>
          </Box>
        )}
        
        {images.length > 1 && (
          <Box className="count-images">
            {currentImageIndex + 1}/{images.length}
          </Box>
        )}

        {images.length > 1 && images.length <= 5 && (
          <Box className="image-dots-wrapper">
            {images.map((_, index) => (
              <Box
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(index);
                }}
                className="image-dots"
                sx={{
                  backgroundColor: index === currentImageIndex 
                    ? '#2f4234' 
                    : 'white',
                  '&:hover': {
                    backgroundColor: '#2f4234',
                    transform: 'scale(1.2)',
                  }
                }}
              />
            ))}
          </Box>
        )}
      </AspectRatio>
      <CardContent>
        <div className="card-interior">
          <Typography 
            level="title-lg" 
            id="card-description"
            sx ={{
              fontSize: 22,
            }}
          >
            {title}
          </Typography>
          <div className="card-price-row">
            <Typography
              level="title-md"
              sx={{ 
                mb: 1,
                color: '#0B6BCB',
                fontWeight: 'bold',
                fontSize: '20px',
              }}
              className="price"
            >
              {formatPrice(price, currency)}
            </Typography>
          </div>
        </div>
        
      </CardContent>
    </Card>
  );
}

export default CardComponent
