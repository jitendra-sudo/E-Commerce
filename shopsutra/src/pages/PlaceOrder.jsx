import React, { useState, useEffect } from 'react';
import TitleHeader from '../compound/titleHeader';
import razorpayLogo from '../assets/razorpay.png';
import stripeLogo from '../assets/stripe.png';
import codLogo from '../assets/cod.png';
import Api from '../compound/Api'
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { loadRazorpayScript } from "../utils/razorpay";
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe("pk_test_51RRBdnCFrBP44Tl4yqHgQZJfecXttS40ctJHUqzUwy4ihNM28Id6T9Vnut2jqPsDe2Y20AvPylQzyLjcItllXKVQ00uryPnJnV");

function PlaceOrder() {
  const [errors, setErrors] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [paymentmethod, setPaymentMethod] = useState('COD');
  const [activeTab, setActiveTab] = useState(2);
  const [addressForm, setAddress] = useState({ firstname: '', lastname: '', email: '', street: '', city: '', state: '', country: '', pincode: '', phonenumber: '' });
  const token = localStorage.getItem('token');
  const [addressList, setAddressList] = useState([])
  const [selectedAddress, setSelectedAddress] = useState({});
  const paymentOptions = { RazorPay: razorpayLogo, Stripe: stripeLogo, COD: codLogo, };
  const location = useLocation();
  const item = location?.state
  const cartItems = useSelector((state) => state?.cart?.cartItems);
  const navigate = useNavigate()


  const HandlePaymentProcess = async () => {
    let products = [];
    let totalAmount = 0;

    const shippingAddress = { name: `${selectedAddress.firstname} ${selectedAddress.lastname}`, addressLine1: selectedAddress.street, addressLine2: '', city: selectedAddress.city, state: selectedAddress.state, zipCode: selectedAddress.pincode, country: selectedAddress.country, };

    if (item?.item) {
      products = [{ productId: item.item._id, quantity: 1 }];
      totalAmount = (item?.item?.price * 1.05) + 50;
    } else if(paymentmethod === 'stripe'){
  products = cartItems?.map(it => ({ productId: it._id, quantity: it.quantity , name:it.name || 1 }));
      totalAmount = (cartItems.reduce((total, item) => total + item.price * item.quantity, 0) * 1.05 + 50).toFixed(2)
    } else {
      products = cartItems?.map(it => ({ productId: it._id, quantity: it.quantity || 1 }));
      totalAmount = (cartItems.reduce((total, item) => total + item.price * item.quantity, 0) * 1.05 + 50).toFixed(2)
    }

    const orderData = { products, totalAmount, shippingAddress, paymentMethod: paymentmethod };

    try {
      if (paymentmethod === 'stripe') {
        const stripe = await stripePromise;
        if (!stripe) {
          toast.error("Stripe failed to load");
          return;
        }

        const res = await Api.post('/place-order-stripe', orderData, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const sessionId = res.data?.stripeSession?.id; 

        if (!sessionId) {
          toast.error("Stripe session creation failed");
          return;
        }

        const result = await stripe.redirectToCheckout({ sessionId });

        if (result.error) {
          toast.error(result.error.message);
        }
        
      }
      else if (paymentmethod === 'razorpay') {
        const loaded = await loadRazorpayScript();
        if (!loaded) {
          toast.error("Razorpay SDK failed to load");
          return;
        }

        const res = await Api.post('/place-order-razorpay', orderData, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const { razorpayOrder, order } = res.data;

        if (!razorpayOrder) {
          toast.error("Failed to create Razorpay order");
          return;
        }

        const options = {
          key: 'rzp_test_H3KvyfMmbSSpw7',
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          name: "ShopSutra Store",
          description: "Order Payment",
          order_id: razorpayOrder.id,
          handler: async function (response) {
            try {
              await Api.post('/placeOrder', {
                ...orderData,
                paymentDetails: response,
                razorpayOrderId: razorpayOrder.id,
                razorpayPaymentId: response.razorpay_payment_id,
              }, {
                headers: { Authorization: `Bearer ${token}` }
              });

              toast.success("✅ Razorpay payment successful & order placed!");
              navigate('/orders');

            } catch (err) {
              toast.error("❌ Payment succeeded but order confirmation failed!");
            }
          },
          prefill: {
            name: shippingAddress.name,
            email: "user@example.com",
            contact: selectedAddress.phonenumber
          },
          notes: {
            address: shippingAddress.addressLine1
          },
          theme: {
            color: "#3399cc"
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      }
      else {
        await Api.post('/placeOrder', orderData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("Order placed successfully!");
          navigate('/orders');
          
      }

    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while placing the order!");
    }
  };


  const HandleAddress = async () => {
    try {
      const res = await Api.get('./address-list', { headers: { Authorization: `Bearer ${token}` } })
      setAddressList(res?.data?.address)
      setSelectedAddress(res?.data?.address[0])
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    HandleAddress()
  }, [])


  const HandleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({
      ...prev,
      [name]: value
    }));
    setErrors('');
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const res = await Api.post('/address', addressForm, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const newAddress = res.data.address;
      setAddressList(newAddress)
      toast.success(res?.data?.message || 'Address added successfully');
      setAddress({ firstname: '', lastname: '', email: '', street: '', city: '', state: '', country: '', pincode: '', phonenumber: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add address');
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await Api.delete(`/address-delete/${id}`)
      toast.success(res?.data?.message)
      setAddressList(addressList.filter((address) => address.id !== id));
    } catch (error) {
      console.log(error)
      toast.error(error?.res?.data?.message || "error in delete")
    }
  }

  return (
    <div className='p-4'>
      <div className='flex flex-col-reverse md:flex-row justify-between gap-16'>
        {/* Delivery Form */}
        <div className=' w-full  lg:w-[450px] border border-gray-300 shadow-xl px-4 md:p-4 rounded-2xl'>
          <TitleHeader task1="DELIVERY" task2="INFORMATION" />
          <form onSubmit={handleAddAddress} className='py-4'>
            <div className="flex gap-2">
              <input type="text" name="firstname" value={addressForm.firstname} onChange={HandleChange} placeholder="First name" className="w-full p-2 my-2 border border-gray-300 rounded-sm" />
              <input type="text" name="lastname" value={addressForm.lastname} onChange={HandleChange} placeholder="Last name" className="w-full p-2 my-2 border border-gray-300 rounded-sm" />
            </div>

            <input type="email" name="email" value={addressForm.email} onChange={HandleChange} placeholder="Email" className="w-full p-2 my-2 border border-gray-300 rounded-sm" />
            <input type="text" name="street" value={addressForm.street} onChange={HandleChange} placeholder="Street" className="w-full p-2 my-2 border border-gray-300 rounded-sm" />

            <div className="flex gap-2">
              <input type="text" name="city" value={addressForm.city} onChange={HandleChange} placeholder="City" className="w-full p-2 my-2 border border-gray-300 rounded-sm" />
              <input type="text" name="state" value={addressForm.state} onChange={HandleChange} placeholder="State" className="w-full p-2 my-2 border border-gray-300 rounded-sm" />
            </div>

            <div className="flex gap-2">
              <input type="text" name="country" value={addressForm.country} onChange={HandleChange} placeholder="Country" className="w-full p-2 my-2 border border-gray-300 rounded-sm" />
              <input type="text" name="pincode" value={addressForm.pincode} onChange={HandleChange} placeholder="Pin Code" className="w-full p-2 my-2 border border-gray-300 rounded-sm" />
            </div>

            <input type="text" name="phonenumber" value={addressForm.phonenumber} onChange={HandleChange} placeholder="Phone Number" className="w-full p-2 my-2 border border-gray-300 rounded-sm" />

            <button type="submit" className="w-full bg-black text-white p-2 my-2 rounded-sm hover:bg-gray-900 transition"> Add Address </button>

            <p className='text-gray-500 text-sm'>
              By placing an order, you agree to our{' '}
              <span className='text-blue-500 cursor-pointer'>Terms of Service</span> and{' '}
              <span className='text-blue-500 cursor-pointer'>Privacy Policy</span>.
            </p>
          </form>
        </div>
        <div className=' w-[60%] lg:max-h-[90vh] md:max-h-[110vh] overflow-x-scroll md:overflow-y-auto ' >
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
            {addressList?.map((item, index) => (
              <label key={index} className={`flex flex-col gap-1 p-4 border rounded-2xl cursor-pointer ${selectedAddress?.id === item.id ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}    >
                <div className="flex justify-between items-center gap-2 mb-2">
                  <div className='flex gap-2'>
                    <input type="checkbox" checked={selectedAddress?.id === item?.id} onChange={() => { setSelectedAddress(item); }} />
                    <span className='text-sm font-bold'>Delivery Address</span>
                  </div>

                  <button onClick={(e) => { e.stopPropagation; handleDelete(item?.id) }}><img className='h-6 w-6' src='https://img.icons8.com/?size=100&id=3YiG3AFVcoqg&format=png&color=000000' /></button>
                </div>
                <div >

                </div>
                <p className='text-sm'>{item.firstname} {item.lastname}</p>
                <p className='truncate text-sm'>{item.email}</p>
                <p className='text-sm'>{item.street}, {item.city}, {item.state}, {item.country} - {item.pinCode}</p>
                <p className='text-sm'>Phone: {item.phonenumber}</p>
              </label>
            ))}
          </div>
        </div>
      </div>
      {/* Cart and Payment Section */}
      <div className='my-4 flex justify-end'>
        <div className='w-full md:w-3/4 lg:w-1/2'>
          <TitleHeader task1="CARTS" task2="TOTALS" />
          <div className='flex flex-col gap-2 p-2'>
            <p className='text-lg font-bold'>Cart Summary</p>
            <div className='flex justify-between'>
              <span>Items:</span> <span>{item ? 1 : cartItems.reduce((total, item) => total + item.quantity, 0)}</span>
            </div>
            <div className='flex justify-between'>
              <span>Total Price:</span><span>₹{item ? item?.item?.price : cartItems.reduce((total, item) => total + item.price * item.quantity, 0)}</span>
            </div>
            <div className='flex justify-between'>
              <span>Tax (5%):</span>
              <span>  ₹ {item ? (item?.item?.price * 0.05) : (cartItems.reduce((total, item) => total + item.price * item.quantity, 0) * 0.05).toFixed(2)}</span>
            </div>
            <div className='flex justify-between'>
              <span>Shipping:</span><span>₹ 50</span>
            </div>
            <div className='flex justify-between font-bold'>
              <span>Total Amount:</span><span>₹ {item ? ((item?.item?.price * 1.05) +
                50) : (
                  cartItems.reduce((total, item) => total + item.price * item.quantity, 0) * 1.05 +
                  50
                ).toFixed(2)}</span>
            </div>
          </div>
          <div className='flex items-start gap-2 p-4'>
            <p className='text-sm text-gray-500'>Select Payment Method:</p>
          </div>
          <div className='flex gap-2 px-4'>
            {Object.entries(paymentOptions).map(([methodName, methodLogo], index) => (
              <div key={methodName} onClick={() => { setPaymentMethod(methodName.toLowerCase()); setActiveTab(index); }} className={`flex w-[130px] h-12 items-center gap-3 p-2 border rounded cursor-pointer justify-center hover:bg-gray-100 transition-all duration-200 ${activeTab === index ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`} >
                <img src={methodLogo} alt={`${methodName} logo`} className={`object-cover ${index == 2 ? 'h-20' : 'h-6'}`} />
              </div>
            ))}
          </div>

          <div className='flex flex-col gap-2 py-2 '>
            {errors && <p className='text-red-500 text-sm'>{errors}</p>}
          </div>

          <div className='flex justify-center'>
            <button onClick={HandlePaymentProcess} className={`w-full bg-black text-white p-2 rounded-sm hover:bg-gray-900 transition ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={isLoading}>
              {isLoading ? 'Processing...' : 'Place Order'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default PlaceOrder;
