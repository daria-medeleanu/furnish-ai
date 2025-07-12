import {BrowserRouter, Route, Routes, Navigate} from "react-router-dom"
import LandingPage from './pages/landingPage/landingPage'
import Login from "./pages/loginPage/login"
import Signup from "./pages/signupPage/signup"
import Home from './pages/homePage/home'
import Cookies from 'js-cookie'
import Profile from "./pages/profilePage/Profile"
import AddProductPage from "./pages/addProductPage/addProductPage"
import ProductPage from "./pages/productPage/productPage"
import CustomizeIDPage from "./pages/customizeIDPage/customizeIDPage"
import Customize from "./components/customize/Customize.jsx"
import ManualMask from "./pages/manualMaskPage/manualMask"
import ProductCustomize from "./components/productCustomize/ProductCustomize.jsx"
import OrderProductPage  from "./pages/orderProductPage/orderProductPage.jsx"
import FavoritesPage from "./pages/favoritesPage/favoritesPage.jsx"
import ResetPasswordPage from "./pages/resetPasswordPage/resetPasswordPage.jsx"
import OrdersPage from "./pages/ordersPage/OrdersPage.jsx"
import SoldProductPage from "./pages/soldProductPage/SoldProductPage.jsx"
import SellerControllerPage from "./pages/sellerControllerPage/SellerControllerPage.jsx"
import AboutPage from "./pages/aboutPage/AboutPage.jsx"
import ProfileSellerPage from "./pages/profileSellerPage/ProfileSellerPage.jsx";

const PrivateRoute = ({ element: Element }) => {
  const token = Cookies.get('token');
  return token ? <Element /> : <Navigate to="/welcome" />;
};

function App() {
  const token = Cookies.get("token")

  function getPayload(jwt){
    return JSON.parse(window.atob(jwt.split(".")[1]));
  }

  if(token){
    const payload = getPayload(token.toString());

    const expiration = new Date(payload.exp * 1000);
    const now = new Date();

    if(now.getTime() >= expiration.getTime() ){
      Cookies.remove('token');
      Cookies.remove('userID');
    }
  }
  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path="/" element= {
          token ? <Navigate to="/home"/> : <Navigate to="/welcome" />
        }
        />
        <Route path="/welcome" element={<LandingPage/>} /> 
        <Route path="/home" element={<PrivateRoute element={Home}  />} />
        <Route path="/login" element={<Login/>}/>
        <Route path="/signup" element={<Signup/>} />
        <Route path="/about" element={<AboutPage/>}/>
        <Route path="/profile" element={<PrivateRoute element={Profile} />} />
        {/* <Route path="/inspire" element={<PrivateRoute element={Inspire} />} /> */}
        <Route path="/welcome" element={<PrivateRoute element={LandingPage} />} />
        <Route path="/product/:id" element={<PrivateRoute element={ProductPage} /> } />
        <Route path="/add" element={<PrivateRoute element={AddProductPage}  />} />
        <Route path="/customize" element={<PrivateRoute element={CustomizeIDPage} />} />
        <Route path="/customize-steps" element={<PrivateRoute element={Customize} />} />
        <Route path="/product-customize" element={<PrivateRoute element={ProductCustomize} /> } />
        <Route path="/manual-mask" element={<PrivateRoute element={ManualMask} />} />
        <Route path="/order/:id" element={<PrivateRoute element={OrderProductPage} /> } />
        <Route path="/favorites" element={<PrivateRoute element={FavoritesPage}/>} />
        <Route path="/reset-password" element={<ResetPasswordPage />}/>
        <Route path="/orders" element={<PrivateRoute element={OrdersPage}/>} />
        <Route path="/sold-product/:id" element={<PrivateRoute element={SoldProductPage} />}/>
        <Route path="/seller-controller" element={<PrivateRoute element={SellerControllerPage}/>}/>
        <Route path="/seller/:sellerId" element={<ProfileSellerPage />} />
      </Routes>
      </BrowserRouter>

    </>
  )
}

export default App
