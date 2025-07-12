import Navbar from '../../components/navbar/Navbar.jsx';
import './profile.css'
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import OffersPopup from '../../components/offersPopup/OffersPopup';
import { useNavigate } from 'react-router-dom'; 
import { useLocation } from 'react-router-dom';
import OrdersList from '../../components/ordersList/OrdersList'; 

const Profile = () => {
  const [user, setUser] = useState(null);
  const [userImg, setUserImg] = useState("");
  const [offersOpen, setOffersOpen] = useState(false);
  const [offers, setOffers] = useState([]);
  const [activeOrders, setActiveOrders] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const [activeProducts, setActiveProducts] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({phone: '', country: '', city: ''});
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.successMessage) {
      setSuccessMessage(location.state.successMessage);
      setTimeout(() => setSuccessMessage(''), 3000);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    const userId = Cookies.get('userID');
    const token = Cookies.get('token');
    if (!userId || !token) return;

    const fetchUser = async () => {
      try {
        const res = await fetch(`http://localhost:5029/api/v1/Auth/${userId}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.value);
          setUserImg(data.value.imageUrl);
        }
      } catch (err) {
        console.error('Failed to fetch user profile:', err);
      }
    };

    const fetchOffers = async () => {
      try {
        const res = await fetch(`http://localhost:5029/api/v1/Offer/user/${userId}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setOffers(data.value || data);
        }
      } catch (err) {
        console.error('Failed to fetch offers:', err);
      }
    };

    const fetchActiveOrders = async () => {
      console.log(userId);
      try {
        const res = await fetch(`http://localhost:5029/api/v1/Orders/client-active-orders/${userId}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          console.log(data);
          setActiveOrders(data);
        }
      } catch (err) {
        console.error('Failed to fetch active orders:', err);
      }
    };

    const fetchOrderHistory = async () => {
      try {
        const res = await fetch(`http://localhost:5029/api/v1/Orders/client-history-orders/${userId}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setOrderHistory(data.value || data);
        }
      } catch (err) {
        console.error('Failed to fetch order history:', err);
      }
    };

    fetchUser();
    fetchOffers();
    fetchActiveOrders();
    fetchOrderHistory();
  }, []);

  const handleEdit = () => setEditMode(true);

  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    const userId = Cookies.get('userID');
    const token = Cookies.get('token');
    try {
      const res = await fetch(`http://localhost:5029/api/v1/Auth/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: user.id,
          phone: editData.phone,
          country: editData.country,
          city: editData.city
        })
      });
      if (res.ok) {
        setUser((prev) => ({
          ...prev,
          phone: editData.phone,
          country: editData.country,
          city: editData.city
        }));
        setEditMode(false);
      } else {
        console.log('Failed to update profile.');
      }
    } catch (err) {
      console.log('Failed to update profile.');
    }
    setSaving(false);
  };

  return (
    <div className="profile-wrapper">
      <Navbar page="home" rightButtonMessage={""}/>
      <div className="profile">
        <h2 className="profile-title">Profile</h2>
        <div className="profile-info">
          <div className="profile-left-side">
            <div className="profile-image-section">
                { userImg ? (
                  <img
                    src={userImg}
                    alt="Profile"
                    className="profile-image"
                  />
                ) : (
                  <AccountCircleIcon style={{width: 200, height: 200}}/>
                )}
              </div>
          </div>
          {!user ? (
            <div>Loading...</div>
          ) : (
            <div className="profile-info">
              <div className="profile-details-section">
                <div><strong>Name:</strong> {user.name} {user.surname}</div>
                <div><strong>Email:</strong> {user.email}</div>
                {editMode ? (
                  <>
                    <div>
                      <strong>Phone:</strong>
                      <input
                        type="text"
                        name="phone"
                        value={editData.phone}
                        onChange={handleChange}
                        className="profile-edit-input"
                      />
                    </div>
                    <div>
                      <strong>Country:</strong>
                      <input
                        type="text"
                        name="country"
                        value={editData.country}
                        onChange={handleChange}
                        className="profile-edit-input"
                      />
                    </div>
                    <div>
                      <strong>City:</strong>
                      <input
                        type="text"
                        name="city"
                        value={editData.city}
                        onChange={handleChange}
                        className="profile-edit-input"
                      />
                    </div>
                    <button
                      className="profile-save-btn"
                      onClick={handleSave}
                      disabled={saving}
                    >
                      {saving ? "Saving..." : "Save"}
                    </button>
                    <button
                      className="profile-cancel-btn"
                      onClick={() => setEditMode(false)}
                      disabled={saving}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <div><strong>Phone:</strong> {user.phone}</div>
                    <div><strong>Country:</strong> {user.country}</div>
                    <div><strong>City:</strong> {user.city}</div>
                    <button className="profile-edit-btn" onClick={handleEdit}>
                      Edit
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="profile-actions-section" style={{marginTop: '2rem'}}>
          <div className="buttons-gap">
            <button className="profile-action-btn" onClick={() => setOffersOpen(true)}>
              See all offers made by you
            </button>
            <button className="profile-action-btn" onClick={() => navigate('/seller-controller')}>
              See you seller controller
            </button>
          </div>
          <OffersPopup open={offersOpen} offers={offers} onClose={() => setOffersOpen(false)} />
          <h3 className="profile-title" style={{marginTop: '2rem'}}>Active Orders</h3>
          <OrdersList orders={activeOrders} />
          <h3 className="profile-title" style={{marginTop: '2rem'}}>Order History</h3>
          <OrdersList orders={orderHistory} history />
        </div>
      </div>
      {successMessage && (
        <div className="success-popup">{successMessage}</div>
      )}
    </div>
  )
}

export default Profile