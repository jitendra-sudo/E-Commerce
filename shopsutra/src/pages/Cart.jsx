import React from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { addToCart, removeFromCart, decreaseQuantity } from '../ContextApi/Cart.slice.js';
import { useNavigate } from 'react-router-dom';


function Cart() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const navigate = useNavigate();
  console.log(cartItems);


  const handleRemoveFromCart = (id) => {
    dispatch(removeFromCart(id));
  }
  const handleDecreaseQuantity = (id) => {
    dispatch(decreaseQuantity(id));
  }

  const handleIncreaseQuantity = (item) => {
    dispatch(addToCart(item));
  }

  if (cartItems.length === 0) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <p className='text-xl text-gray-400'>Your cart is empty</p>
      </div>
    );
  }

  const handleProceed = () =>{
       navigate('/placeorder')
  }


  return (
    <div className=''>
      <div className='flex justify-between items-center  p-4'>
        <h1 className='text-2xl font-semibold'>Your Cart</h1>
      </div>
      <div className='p-4'>
        {cartItems.map((item) => (
          <div key={item._id} className='block  md:flex justify-between items-center border-b py-4'>
            <div className='flex items-center gap-4'>
              <img src={item.image[0]} alt={item.name} className='w-20 h-20 object-cover' />
              <div>
                <h2 className=' text-sm md:text-lg font-semibold'>{item.name}</h2>
                <p className='text-gray-600 text-[12px]'>Size: {item.selectedSize}</p>
                <p className='text-gray-600 text-[14px]'>Price: ₹{item.price}</p>
              </div>
            </div>
            <div className='flex  pt-2 items-center gap-4'>
              <button onClick={() => handleDecreaseQuantity(item._id)} className='bg-gray-200 px-2 py-1 rounded'>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => handleIncreaseQuantity(item)} className='bg-gray-200 px-2 py-1 rounded'>+</button>
              <button onClick={() => handleRemoveFromCart(item._id)} className='bg-red-500 text-white px-2 py-1 rounded'>Remove</button>
            </div>
          </div>
        ))}

        <div className='mt-8    w-full max-w-md ml-auto bg-white'>
          <h2 className='text-2xl font-bold  mb-4'>Cart Summary</h2>
          <div className='space-y-2 text-lg'>
            <p className='flex justify-between'>
              <span>Total Items:</span>
              <span>{cartItems.length}</span>
            </p>
            <p className='flex justify-between'>
              <span>Total Quantity:</span>
              <span>{cartItems.reduce((total, item) => total + item.quantity, 0)}</span>
            </p>
            <p className='flex justify-between'>
              <span>Subtotal:</span>
              <span>₹{cartItems.reduce((total, item) => total + item.price * item.quantity, 0)}</span>
            </p>
            <p className='flex justify-between'>
              <span>Tax (5%):</span>
              <span>
                ₹
                {(
                  cartItems.reduce((total, item) => total + item.price * item.quantity, 0) * 0.05
                ).toFixed(2)}
              </span>
            </p>
            <p className='flex justify-between'>
              <span>Delivery Charges:</span>
              <span>₹50</span>
            </p>
            <hr />
            <p className='flex justify-between font-bold text-xl'>
              <span>Grand Total:</span>
              <span>
                ₹
                {(
                  cartItems.reduce((total, item) => total + item.price * item.quantity, 0) * 1.05 +
                  50
                ).toFixed(2)}
              </span>
            </p>
          </div>

          <button onClick={handleProceed} className='w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white text-lg py-2 rounded shadow transition'>
            Proceed to Checkout
          </button>
        </div>

      </div>
    </div>
  )
}

export default Cart
