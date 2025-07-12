import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import ProductCarousel from '../../components/productsCarousel/ProductsCarousel';
import Navbar from '../../components/navbar/Navbar';
import {useNavigate} from 'react-router-dom'
import SellerOrdersList from '../../components/sellerOrdersList/SellerOrdersList'

const SellerControllerPage = () => {
  const [soldProducts, setSoldProducts] = useState([]);
  const [activeProducts, setActiveProducts] = useState([]);
  const [activeOrders, setActiveOrders] = useState([]);
  const navigate = useNavigate();

  const fetchData = async () => {
    const token = Cookies.get('token');
    const userId = Cookies.get('userID');
    try {
     
      const res = await fetch(`http://localhost:5029/api/v1/Products/getbyuserid/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        console.log('active products', data);
        setActiveProducts((data.value || data).filter(p => p.isActive));
      }

      
      const activeOrd = await fetch(`http://localhost:5029/api/v1/Orders/seller-active-orders/${userId}`,{
        headers: {'Authorization': `Bearer ${token}`}
      });
      if (activeOrd.ok){
        const data = await activeOrd.json();
        console.log('active orders', data);
        setActiveOrders(data.value || data);
      }

     
      const soldRes = await fetch(`http://localhost:5029/api/v1/Orders/seller-history-orders/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (soldRes.ok) {
        const soldData = await soldRes.json();
        console.log('Finished orders', soldData)
        setSoldProducts(soldData.value || soldData);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleProductDelete = (productId) => {
    setActiveProducts(prev => prev.filter(p => p.id !== productId));
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect((()=> {
    console.log(soldProducts);
  }), [soldProducts])

  return (
    <div>
      <Navbar page="home" />
      <div style={{ fontFamily:"'DM Sans:Medium', sans-serif", maxWidth: 1100, margin: '0 auto', padding: 24 }}>
        <h2 style={{ marginTop: 40, fontFamily:"'DM Sans:Medium', sans-serif",}}>Active Products</h2>
        <SellerOrdersList
          orders={activeProducts}
          type="products"
          onProductDelete={handleProductDelete}
        />
        <h2>Active Orders</h2>
        <SellerOrdersList
          orders={activeOrders}
          type="orders"
          onOrderUpdate={fetchData}
        />
        <h2>Finalized Orders</h2>
        <SellerOrdersList
          orders={soldProducts}
          type="history"
        />
      </div>
    </div>
  );
};

export default SellerControllerPage;