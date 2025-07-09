import React, { useState, useEffect } from 'react'
import Api from '../compound/Api'
import { toast } from 'react-toastify'

function Orders() {
  const [allOrder, setALlOrder] = useState([])

  useEffect(() => {
    const fetchingOrders = async () => {
      try {
        const res = await Api.get('getallorders')
        setALlOrder(res?.data)
        console.log(res)
      } catch (error) {
        console.log(error)
      }
    }
    fetchingOrders()
  }, [])

  const cancelBtn = ['Dispatched', 'Shipped', 'Delivered', 'Cancelled']

  const handleCancelOrder = async (id) => {
    try {
      const res = await Api.delete(`/cancel-order/${id}`);
      if (res.status === 200) {
        toast.success('Order cancelled successfully!');
        setALlOrder(prev => prev.filter(order => order._id !== id));
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      alert('Failed to cancel order.');
    }
  };



  return (
    <div className='py-2'>
      {allOrder?.length == 0 &&
        <div className='h-[80vh] flex justify-center items-center'>
          <p className='text-gray-500'>No orders</p>
        </div>
      }
      <div className="space-y-6 p-4">
        {allOrder?.map((order) => (
          <div key={order._id} className="min-h-40 flex justify-between flex-col md:flex-row  border border-gray-300 p-4 rounded-xl shadow-sm bg-white">
            <div>
              <div>
                <h2 className="text-md font-semibold">Order #{order._id.slice(-6)}</h2>
                <p>Placed on: {new Date(order.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <p>
                  Products:
                  {order?.products?.map((product, index) => (
                    <span key={index}>
                      {product?.productId}{index !== order.products.length - 1 && ', '}
                    </span>
                  ))}
                </p>
              </div>

            </div>

            <div className='flex items-center'>
              <p>Status: <span className="text-yellow-600">{order.status}</span></p>
            </div>

            <div className='flex flex-col-reverse md:flex-col justify-between gap-4'>
              <div className='flex justify-end'>
                {!cancelBtn.includes(order.status) && (
                  <button onClick={() => handleCancelOrder(order?._id)} className="px-2 py-1 bg-red-500 hover:bg-red-600 cursor-pointer text-white rounded-md"> Cancel </button>
                )}
              </div>

              <div className='flex gap-4'>
                <p>Payment: <strong>{order.paymentMethod}</strong></p>
                <p>Total:  <strong>₹ {order.totalAmount}</strong></p>
              </div>
            </div>
          </div>
        ))}
      </div>



    </div>
  )
}



export default Orders
