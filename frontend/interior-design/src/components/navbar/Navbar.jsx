import { data, Link } from 'react-router-dom'
import './navbar.css'
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie'; 
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ page, rightButtonMessage, onSearch }) => {
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [userImage, setUserImage] = useState(null);   const handleProfileClick = () => setShowProfilePopup((prev) => !prev);
  const [showFavoritesPopup, setShowFavoritesPopup] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [autocompleteValue, setAutocompleteValue] = useState(null);
  const [autocompleteInput, setAutocompleteInput] = useState('');
  const [searchOptions, setSearchOptions] = useState([{title: 'No products found'}]);
  const [lastSearch, setLastSearch] = useState('');
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
      setIsMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
      setIsMobileMenuOpen(false);
  };
  const handleClosePopup = () => setShowProfilePopup(false);
  
  const handleLogout = () => {
    document.cookie = 'token=; Max-Age=0; path=/;';
    document.cookie = 'userID=; Max-Age=0; path=/;';
    document.cookie = 'email=; Max-Age=0; path=/;';
    window.location.href = '/login';
  };
  const handleGetUserInformation = async () => {
    const userId = Cookies.get("userID");
    const token = Cookies.get('token');
    
    try {
      const response = await fetch(`http://localhost:5029/api/v1/Auth/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include', 
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData);
        return;
      }
      const userData = await response.json();
      sessionStorage.setItem('userName', userData.value.name);
      sessionStorage.setItem('userSurname', userData.value.surname);
      const imgUrl = userData.value.imageUrl || null;
      
      if (imgUrl) {
        setUserImage(imgUrl);
        Cookies.set('userImage', imgUrl, { expires: 7 }); 
      }
      
    } catch (error) {
      console.error(error);
    }
  }

  const handleFavoriteToggle = async (productId) => {
    const token = Cookies.get('token');
    const userId = Cookies.get('userID');

    try {
      await fetch('http://localhost:5029/api/v1/Favorites/toggle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: userId,
          productId: productId
        })
      });
      fetchFavorites(); // Refresh favorites list after toggling
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
    }
  };

  const fetchFavorites = async () => {
    const userId = Cookies.get('userID');
    const token = Cookies.get('token');
    if (!userId || !token) return;
    try {
      const response = await fetch(`http://localhost:5029/api/v1/Favorites?userId=${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setFavorites(data.slice(0, 20));
      }
    } catch (err) {
      console.error('Failed to fetch favorites:', err);
    }
  };

  const handleFavoritesClick = () => {
    setShowFavoritesPopup((prev) => !prev);
    if (!showFavoritesPopup) fetchFavorites();
  };

const handleAutocompleteInputChange = async (event, newInputValue) => {
    setAutocompleteInput(newInputValue);
    setAutocompleteValue(newInputValue);
    localStorage.setItem('lastSearchTerm', newInputValue);

    if (!newInputValue || newInputValue.trim() === "") {
        setSearchOptions([{ title: "Look for something" }]);
      
    }

    try {
        const token = Cookies.get('token');
        const response = await fetch(`http://localhost:5029/api/v1/Products/searchbox/${encodeURIComponent(newInputValue)}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const data = await response.json();
            const options = data.length > 0 ? data.map(item => ({ title: item.title, id: item.id })) : [{ title: "No results found" }];
            setSearchOptions(options);
        } else {
            setSearchOptions([{ title: "No results found" }]);
        }
    } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSearchOptions([{ title: "No results found" }]);
    }
};

  // const handleAutocompleteKeyDown = (event) => {
  //   if (event.key === 'Enter') {
  //       event.preventDefault();
  //       if (onSearch) {
  //           setLastSearch(autocompleteInput);
  //           setAutocompleteInput(autocompleteInput); 
  //           onSearch(autocompleteInput);
  //       }
  //   }
  // };
  const handleAutocompleteChange = (event, newValue) => {
    if (typeof newValue === 'string') {
        setAutocompleteValue(newValue);
        setAutocompleteInput(newValue);
        setLastSearch(newValue);
        localStorage.setItem('lastSearchTerm', newValue);
        console.log('asta se selecteaza')
        if (onSearch) onSearch(newValue); 
    } else if (newValue && newValue.title && newValue.title !== "No results found") {
        setAutocompleteValue(newValue.title);
        setAutocompleteInput(newValue.title);
        setLastSearch(newValue.title);
        localStorage.setItem('lastSearchTerm', newValue.title);
        console.log(newValue)
        navigate(`/product/${newValue.id}`); 
        if (onSearch) onSearch(newValue.title);
    }
};

const handleAutocompleteKeyDown = (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        if (onSearch /*&& autocompleteInput.trim() !== ""*/) {
            onSearch(autocompleteInput); 
        }
    }
};

  useEffect(() => {
    if (!userImage && page !== 'login' && page !== 'signup') {
      handleGetUserInformation();
    }
  }, [page]);

  useEffect(() => {
    const storedInput = localStorage.getItem('lastSearchTerm');
    if (storedInput) {
        setAutocompleteInput(storedInput);
    }
}, []);

  return (
    <div className = "nav-bar">
        {page === 'login' && (
          <>
            <Link to="/">
              <div className="main-title"> 
                <img src="/final-logo1080.png" alt="Furnish AI Logo" className="navbar-logo" />
              </div>
            </Link>
            <Link to="/signup">
              <div className = "right-button">{rightButtonMessage}</div>
            </Link>
          </>
        )}
        {page === 'signup' && (
          <>
            <Link to="/">
              <div className="main-title"> 
                <img src="/final-logo1080.png" alt="Furnish AI Logo" className="navbar-logo" />
              </div>
            </Link>
            <Link to="/login">
              <div className = "right-button">{rightButtonMessage}</div>
            </Link>
          </>
        )}
        { (page === 'home' || page === 'inspire')  && (
          <>
            <Link to="/home">
              <div className="main-title"> 
                <img src="/final-logo1080.png" alt="Furnish AI Logo" className="navbar-logo" />
              </div>
            </Link>
            <div className="navbar-desktop">

              <Autocomplete
                id="navbar-autocomplete-search"
                options={searchOptions}
                getOptionLabel={(option) => typeof option === 'string' ? option : option.title}
                value={autocompleteValue}
                inputValue={autocompleteInput}
                onChange={handleAutocompleteChange}
                onInputChange={handleAutocompleteInputChange}
                freeSolo
                renderOption={(props, option) => (
                  <li {...props} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {option.icon}
                    <span>{option.title}</span>
                  </li>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder={lastSearch ? lastSearch : "Search for a piece of furniture.."}
                    InputLabelProps={{ shrink: false }}
                    onKeyDown={handleAutocompleteKeyDown}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '20px',
                      },
                      '& .MuiInputBase-root': {
                        borderRadius: '20px',
                      },
                      '& .MuiAutocomplete-tag': {
                        borderRadius: '12px',
                      }
                    }}
                  />
                )}
                sx={{ width: '550px', marginRight: 2 }}
              />
              <div className="navbar-desktop-right-side">

                <div style={{ position: 'relative', display: 'flex', alignItems:'center',  justifyContent:'center'}}>
                  <div className="favorite-wrapper">
                    <div 
                      className="nav-bar-button " 
                      style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                      onClick={handleFavoritesClick}  
                    >
                      
                      <FavoriteIcon sx={{ color: '#e53935' }} />
                    </div>

                  </div>
                  {showFavoritesPopup && (
                    <div
                      className="favorites-popup"
                      onMouseLeave={() => setShowFavoritesPopup(false)}
                    >
                      <div className="favorites-popup-title">Your Favorites</div>
                      {favorites.length === 0 && (
                        <div className="favorites-popup-empty">No favorite products yet.</div>
                      )}
                      {favorites.slice(0, 4).map((fav, idx) => (
                        <div
                          key={fav.id || idx}
                          className="favorites-popup-item"
                          onClick={() => window.location.href = `/product/${fav.productId}`}
                        >
                          <div className="direction-horizontal">
                            <img
                              src={fav.product.imageUrls[1]}
                              alt={fav.product.title}
                              className="favorites-popup-img"
                            />
                            <div className="favorites-popup-item-title">{fav.product.title}</div>
                            <div className="favorites-popup-item-price">
                              {fav.product.price} {fav.product.currency}
                            </div>
                          </div>
                          <div
                            className={`favorite-button-product ${ 'favorited' }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFavoriteToggle(fav.productId);
                            }}
                          >
                            <FavoriteIcon sx={{ color: '#e53935' }}/>  
                          </div>
                        </div>
                      ))}
                      <button
                        className="favorites-popup-seeall-btn"
                        onClick={() => {
                          setShowFavoritesPopup(false);
                          navigate('/favorites', { state: { products: favorites } });
                        }}
                      >
                        See all favorites
                      </button>
                    </div>
                  )}
                </div>
                <div className="profile-button-wrapper" style={{ position: 'relative' }}>
                  {userImage ? (
                    <img
                      src={userImage}
                      alt="Profile"
                      onClick={handleProfileClick}
                      onError={(e) => { e.target.onerror = null; e.target.src = '';  }}
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: '50%',
                        objectFit: 'cover',
                        cursor: 'pointer',
                        border: '2px solid #485c11',
                        background: '#fff',
                      }}
                    />
                  ) : (
                    <AccountCircleIcon sx={{ color: '#485c11', cursor: 'pointer', width: '44px', height: '44px' }} fontSize='large' onClick={handleProfileClick} />
                  )}
                  
                  {showProfilePopup && (
                    <div className="profile-popup" onMouseLeave={handleClosePopup}>
                      <Link to="/profile">
                        <div className="profile-popup-option">Profile</div>
                      </Link>
                      <Link to="/seller-controller">
                        <div className="profile-popup-option">Seller Controller</div>
                      </Link>
                      <div className="profile-popup-option" onClick={handleLogout}>Logout</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="navbar-mobile">
              <div className="hamburger-menu" onClick={toggleMobileMenu}>
                ☰
              </div>
            </div>

            {isMobileMenuOpen && (
              <div className="mobile-menu-overlay" onClick={closeMobileMenu}>
                <div className="mobile-menu-content" onClick={(e) => e.stopPropagation()}>
                  
                  <div className="mobile-menu-item">
                    <Link to="/home" onClick={closeMobileMenu}>Home</Link>
                  </div>
                  <div className="mobile-menu-item" onClick={handleFavoritesClick}>
                    Favorites
                  </div>
                  <div className="mobile-menu-item" onClick={handleProfileClick}>
                    Profile
                  </div>
                  <div className="mobile-menu-item" onClick={handleLogout}>
                    Logout
                  </div>
                  <div className="mobile-menu-item" onClick={closeMobileMenu}>
                    Close
                  </div>
                </div>
              </div>
            )}

            
          </>
        )}
      </div>
  )
}

export default Navbar
