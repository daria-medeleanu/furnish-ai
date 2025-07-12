import { useEffect, useState } from 'react'
import { useLocation, Link, useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie';
import Navbar from '../../components/navbar/Navbar';
import CardComponent from '../../components/card/Card';
import LoadingSpinner from '../../components/loader/Loader';
import Pagination from '@mui/material/Pagination';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Slider from '@mui/material/Slider';
import './home.css'

const home = () => {
  const location = useLocation();
  const [successMessage, setSuccessMessage] = useState('');
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(null);
  const [filterCategory, setFilterCategory] = useState(null);
  const [filterCategoryInput, setFilterCategoryInput] = useState('');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [cityOptions, setCityOptions] = useState([]);
  const [filterCity, setFilterCity] = useState(null);
  const [filterCityInput, setFilterCityInput] = useState('');
  const [furnitureCategories, setFurnitureCategories] = useState([]);
  const [filters, setFilters] = useState({
    category: null,
    city: '',
    priceRange: [0, 10000]
  })
    useEffect(() => {
      const fetchCategories = async () => {
        try {
          const token = Cookies.get('token');
          const response = await fetch('http://localhost:5029/api/v1/Categories', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          const result = await response.json();
          if (response.ok) {
            setFurnitureCategories(result.data || result);
          } else {
            console.error('Failed to fetch categories:', result.message);
          }
        } catch (err) {
          console.error('Error fetching categories:', err);
        } 
      };
      fetchCategories();
    }, []);

  useEffect(() => {
    if (location.state && location.state.successMessage) {
      setSuccessMessage(location.state.successMessage);
      setTimeout(() => setSuccessMessage(''), 3000);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {

    const fetchUserInfo = async () => {
      const userId = Cookies.get('userID');
      const token = Cookies.get('token');
      if (!userId) return;
      try {
        const response = await fetch(`http://localhost:5029/api/v1/Auth/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          credentials: 'include',
        });
        if (!response.ok) return;
        const userData = await response.json();
        setUserName(userData.value.name);
      } catch (err) {
      }
    };
    fetchUserInfo();
  }, []);

  useEffect(() => {
    if (searchResults !== null) return; 

    const fetchProducts = async () => {
      setLoading(true);
      setError('');
      try {
        const token = Cookies.get('token');

        let url = `http://localhost:5029/api/v1/Products/paginated?page=${page}&pageSize=${pageSize}`;
        // Add filters if present
        if (filters) {
          url += `&minPrice=${filters.priceRange[0]}&maxPrice=${filters.priceRange[1]}`;
          if (filters.city) url += `&city=${filters.city}`;
          if (filters.category?.id) url += `&categoryId=${filters.category.id}`;
        }

        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          setError('Failed to fetch products.');
          setLoading(false);
          return;
        }
        const data = await response.json();
        setProducts(data.items || []);
        setTotalCount(data.totalCount || 0);
                
      } catch (err) {
        setError('Network error.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [page, pageSize, searchResults, filters]);

  const handlePageChange = (event, value) => {
    console.log(value);
    setPage(value);
  };

  const handleCardClick = (id) => {
    navigate(`/product/${id}`);
  };

const handleNavbarSearch = async (term) => {
    setSearchTerm(term);
    localStorage.setItem('lastSearchTerm', term);

    if (term.trim() === '') {
        setSearchResults(null);
        setProducts([]);
        setTotalCount(0);
        setPage(1);
        return;
    }

    setLoading(true);
    setError('');
    try {
        const token = Cookies.get('token');
        console.log(term)
        const response = await fetch(`http://localhost:5029/api/v1/Products/paginated?page=1&pageSize=${pageSize}&title=${encodeURIComponent(term)}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) {
          setError('Failed to fetch products.');
          setLoading(false);
          return;
        }
        
        const data = await response.json();
        console.log('test',data);
        const results = data;
        
        if (results.length === 0) {
            // setError('No products found.');
        }

        setSearchResults(results.items);
        setProducts(results.items);
        setTotalCount(results.totalCount);
        setPage(1);
    } catch (err) {
        setError('Network error.');
    } finally {
        setLoading(false);
    }
};

useEffect(() => {
    const lastSearchTerm = localStorage.getItem('lastSearchTerm');
    if (lastSearchTerm) {
        setSearchTerm(lastSearchTerm);
    }
}, []);

const handleFilterToggle = () => {
  setShowFilters((prev) => !prev);
};

useEffect(() => {
  if (showFilters) {
    const romanianCities = [
      "Bucharest", "Cluj-Napoca", "Timișoara", "Iași", "Constanța",
      "Craiova", "Brașov", "Galați", "Ploiești", "Oradea"
    ];
    const allProducts = searchResults !== null ? searchResults : products;
    setCityOptions(romanianCities.map(city => ({ title: city })));
  }
}, [showFilters, searchResults, products]);

const handleApplyFilters = async () => {  
  setFilters({
    category: filterCategory,
    city: filterCityInput,
    priceRange: priceRange
  });
  setPage(1);
  setShowFilters(false);
};

const handleClearFilters = () => {
  setFilters({
    category: null,
    city: '',
    priceRange: [0, 10000]
  });
  setFilterCategory(null);
  setFilterCategoryInput('');
  setFilterCity(null);
  setFilterCityInput('');
  setPage(1);
  setShowFilters(false);
};
  

if (loading){
  return <LoadingSpinner mgs={"Loading products..."}/>
} 

if (error) return <div style={{color: 'red'}}>{error}</div>;

  
  return (
    <div className="homepage">
      {successMessage && (
        <div className="success-popup">{successMessage}</div>
      )}      
      <Navbar page={"home"} rightButtonMessage={"nothing"} onSearch={handleNavbarSearch}/>
      <div className="home-header">
        <h1 className="welcome-text">Nice to see you{userName ? `, ${userName}!` : '!'}</h1>
        <Link to={"/add"} className="add-btn-link">
          <button className="add-btn">+ Add Product</button>
        </Link>
      </div>  
      <div style={{ marginTop: 8, marginBottom: 8 }}>
        <div className="applied-filters"> 
          <button onClick={handleFilterToggle} className="filters-button" >Filters</button>  
        </div>
        {showFilters && (
          <div 
            style={{
              position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.25)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center'
            }} 
            onClick={handleClearFilters}>
            <div style={{ background: '#fff', borderRadius: 12, padding: 32, minWidth: 520, boxShadow: '0 2px 16px rgba(0,0,0,0.25)', position: 'relative', fontFamily: 'DS-Family, sans-serif' }} onClick={e => e.stopPropagation()}>
              <h3 style={{ marginTop: 0 }}>Filter Products</h3>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 4 }}>Category:</label>
                <Autocomplete
                  id="filter-category-autocomplete"
                  options={furnitureCategories}
                  getOptionLabel={option => option.title}
                  value={filterCategory}
                  inputValue={filterCategoryInput}
                  onChange={(e, newValue) => setFilterCategory(newValue)}
                  onInputChange={(e, newInputValue) => setFilterCategoryInput(newInputValue)}
                  renderInput={(params) => (
                    <TextField {...params} placeholder="Select or type a category..." />
                  )}
                  sx={{ width: 250 }}
                  isOptionEqualToValue={(option, value) => option.title === value.title}
                  freeSolo
                />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 4 }}>City:</label>
                  <Autocomplete
                    id="filter-city-autocomplete"
                    options={cityOptions}
                    getOptionLabel={option => option.title}
                    value={filterCity}
                    inputValue={filterCityInput}
                    onChange={(e, newValue) => setFilterCity(newValue)}
                    onInputChange={(e, newInputValue) => setFilterCityInput(newInputValue)}
                    renderInput={(params) => (
                      <TextField {...params} placeholder="Select or type a city..." />
                    )}
                    sx={{ width: 250 }}
                    isOptionEqualToValue={(option, value) => option.title === value.title}
                    freeSolo
                  />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 4 }}>Price Range:</label>
                <div style={{ width: 250, marginLeft: 8, marginRight: 8 }}>
                  <Slider
                    value={priceRange}
                    onChange={(e, newValue) => setPriceRange(newValue)}
                    valueLabelDisplay="auto"
                    min={0}
                    max={10000}
                    step={10}
                    sx={{ color: '#485c11' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginTop: 4 }}>
                    <span>{priceRange[0]} RON</span>
                    <span>{priceRange[1]} RON</span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                <button onClick={handleApplyFilters} style={{ background: '#4CAF50', color: 'white', border: 'none', borderRadius: 4, padding: '8px 18px' }}>Apply</button>
                <button onClick={handleClearFilters} style={{ background: '#e53935', color: 'white', border: 'none', borderRadius: 4, padding: '8px 18px' }}>Clear</button>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="ai-banner">
        <div className="ai-banner-text">
          ✨ Unleash your creativity! Try our AI-powered tool to visualize your dream furniture in any setting.
        </div>
        <Link to="/customize">
          <button className="ai-button">Try our AI Model</button>
        </Link>
      </div>
      <div className="card-wrapper">
        {(searchResults !== null ? searchResults : products).length === 0 ? (
          <div style={{ textAlign: 'center', color: 'grey', fontSize: '18px', marginTop: '20px', fontFamily: 'DS-Family, sans-serif' }}>
            No products found.
          </div>
        ) : (
        (searchResults !== null ? searchResults : products).map((item, idx) => (
          <div key={item.id || item.productID || idx} style={{ position: 'relative', marginBottom: '20px', width: '60%', display: 'flex', justifyContent: 'center' }}>
            <div className="condition-badge" >
              {item.condition}
            </div>
            <CardComponent 
              title={item.title}
              price={item.price}
              currency={item.currency}
              condition={item.condition}
              description={item.description}
              imageUrl={item.img || '/assets/canapea.jpg'}
              imageUrls={item.imageUrls}
              isFavorite = {item.isFavorite}
              onClick={() => handleCardClick(item.id || item.productID)}
              productId={item.id}
            />
          </div>
        ))
      )}
      </div>
      <div className="pagination">
        <Pagination 
          count={Math.ceil(totalCount/pageSize)}
          page={page} 
          onChange={handlePageChange}/>
      </div>
    </div>
  )
}

export default home