import React, { useEffect, useState } from 'react'
import { replace, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Collection from './pages/Collection'
import Contact from './pages/Contact'
import Orders from './pages/Orders'
import Product from './pages/Product'
import Cart from './pages/Cart'
import PlaceOrder from './pages/PlaceOrder'
import Navbar from './compound/Navbar'
import Footer from './compound/Footer'
import Login from './compound/login.jsx'
import Profile from './pages/profile.jsx'
import ProfileEdit from './pages/ProfileEdit.jsx'
import store from './ContextApi/store.js'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProtectedRoute from './compound/protectedRoute.jsx';
import Settings from './pages/settings.jsx'
import Admin from './pages/Admin.jsx'
import Wishlist from './pages/Wishlist.jsx'
import { useSelector } from 'react-redux'
import { useLocation , useNavigate } from 'react-router-dom'
import SearchPage from './pages/SearchPage.jsx'

const App = () => {
  const { user, resData, } = useSelector((state) => state.auth);
  const location = useLocation()
  const navigate = useNavigate()

   useEffect(() => {
    if (
      resData?.accessToken &&
      resData?.role === 'admin' &&
      location.pathname === '/dashboard'
    ) {
      navigate('/', { replace: true });
    }
  }, [resData, location.pathname, navigate]);

  


  return (
    <div className="px-0 md:px-2 lg:px-20" style={{ fontFamily: 'Poppins, sans-serif' }}>
      <Navbar />
      <hr className=' text-gray-300' />
      <Routes>
        <Route path='/' element={<Home />} />
        {resData?.role == 'admin' && <Route path='/dashboard' element={<Admin />} />}
        <Route path='/profile' element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path='/profile-edit' element={<ProtectedRoute><ProfileEdit /></ProtectedRoute>} />
        <Route path='/login' element={<ProtectedRoute><Login /></ProtectedRoute>} />
        <Route path='/wishlist' element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
        <Route path='/about' element={<About />} />
        <Route path='/search' element={<SearchPage />} />
        <Route path='/collection' element={<Collection />} />
        <Route path='/settings' element={<Settings />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/orders' element={<ProtectedRoute><Orders /></ProtectedRoute>} />
        <Route path='/product/:id' element={<Product />} />
        <Route path='/cart' element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path='/placeorder' element={<ProtectedRoute><PlaceOrder /></ProtectedRoute>} />
      </Routes>
      <Footer />

      <ToastContainer position="top-right" autoClose={2000} theme="light" />
    </div>
  )
}

export default App
