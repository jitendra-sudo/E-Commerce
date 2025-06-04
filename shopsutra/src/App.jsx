import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import About from './pages/About'
import Collection from './pages/Collection'
import Contact from './pages/Contact'
import Orders from './pages/Orders'
import Product from './pages/Product'
import Cart from './pages/Cart'
import PlaceOrder from './pages/PlaceOrder'
import Navbar from './compound/Navbar'
import Footer from './compound/Footer'
const App = () => {
  return (
    <div className="px-0 md:px-2 lg:px-20" style={{ fontFamily: 'Poppins, sans-serif' }}>
      <Navbar />
      <hr className=' text-gray-300' />

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/about' element={<About />} />
        <Route path='/collection' element={<Collection />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/orders' element={<Orders />} />
        <Route path='/product/:id' element={<Product />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/placeorder' element={<PlaceOrder />} />

      </Routes>
      <div className='pt-6'>
        {/* <hr className='text-gray-300 ' /> */}
        <Footer />
      </div>

    </div>
  )
}

export default App
