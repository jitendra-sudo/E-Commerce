import React, { useState, useEffect } from 'react';
import Api from '../compound/Api';
import AddProduct from '../compound/AddProduct';
import { toast } from 'react-toastify';

function Admin() {
  const [activeTab, setActiveTab] = useState('AllProducts');
  const [allProducts, setAllProducts] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const statusOptions = ['Pending', 'Out for Delivery', 'Dispatched', 'Shipped', 'Delivered', 'Cancelled'];
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };

        if (activeTab === 'AllProducts') {
          const res = await Api.get('/', config);
          setAllProducts(res.data);
        } else if (activeTab === 'AllOrders') {
          const res = await Api.get('getallorders', config);
          setAllOrders(res.data);
        }
      } catch (error) {
        toast.error('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab, showAddModal]);

  const handleRemoveProduct = async (id) => {
    if (!window.confirm('Are you sure you want to remove this product?')) return;

    try {
      await Api.delete(`/romveproduct/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllProducts((prev) => prev.filter((p) => p._id !== id));
      toast.success('Product removed');
    } catch (error) {
      toast.error('Failed to remove product');
    }
  };

  const handleChangeOrderStatus = async (orderId, newStatus) => {
    try {
      await Api.put(`/update-order/${orderId}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Order status updated');
      setAllOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center'>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('AllProducts')}
            className={`px-4 py-2 rounded ${activeTab === 'AllProducts' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            All Products
          </button>
          <button
            onClick={() => setActiveTab('AllOrders')}
            className={`px-4 py-2 rounded ${activeTab === 'AllOrders' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            All Orders
          </button>
        </div>
        <div>
          <button onClick={() => setShowAddModal(true)} className="bg-green-600 text-white px-4 py-2 rounded">
            + Add Product
          </button>
        </div>
      </div>

      <div>
        {activeTab === 'AllProducts' && (
          <div className="flex flex-col gap-4 w-full">
            {allProducts.map((product) => (
              <div key={product._id} className="border border-gray-300 flex justify-between p-2 rounded shadow-sm w-full">
                <img src={product.image[0]} alt={product.name} className="w-20 h-20 object-cover rounded" />
                <div>
                  <h3 className="font-semibold text-lg">{product.name}</h3>
                  <p className="text-sm text-gray-600">{product.category} / {product.subcategory}</p>
                  <p className="text-gray-800 font-semibold mt-1">₹{product.price}</p>
                </div>
                <div className='flex justify-center items-center gap-2'>
                  <button
                    onClick={() => handleRemoveProduct(product._id)}
                    className="bg-red-500 text-white text-sm px-4 py-1.5 rounded hover:bg-red-600 transition"
                  >
                    Remove
                  </button>
                  <button
                    disabled
                    className="bg-blue-500 text-white text-sm px-4 py-1.5 rounded"
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'AllOrders' && (
          <div className="overflow-auto">
            <table className="w-full border rounded shadow-sm text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2">Order ID</th>
                  <th className="px-4 py-2">User</th>
                  <th className="px-4 py-2">Shipping Address</th>
                  <th className="px-4 py-2">Payment</th>
                  <th className="px-4 py-2">Total</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {allOrders.map((order) => (
                  <tr key={order._id} className="border-t">
                    <td className="px-4 py-2">{order._id}</td>
                    <td className="px-4 py-2">
                      <p className="font-semibold">{order.userId?.name}</p>
                      <p className="text-sm text-gray-500">{order.userId?.email}</p>
                    </td>
                    <td className="px-4 py-2 text-sm">
                      <p>{order.shippingAddress?.name}</p>
                      <p>{order.shippingAddress?.addressLine1}</p>
                      {order.shippingAddress?.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                      <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.postalCode}</p>
                      <p>📞 {order.shippingAddress?.phone}</p>
                    </td>
                    <td className="px-4 py-2">{order.paymentMethod}</td>
                    <td className="px-4 py-2">₹{order.totalAmount}</td>
                    <td className="px-4 py-2">{order.status}</td>
                    <td className="px-4 py-2">
                      <select
                        value={order.status}
                        onChange={(e) => handleChangeOrderStatus(order._id, e.target.value)}
                        className="border px-2 py-1 rounded bg-white"
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {((activeTab === 'AllProducts' && allProducts.length === 0) ||
        (activeTab === 'AllOrders' && allOrders.length === 0)) && (
          <div className='flex justify-center items-center min-h-[80vh]'>
            <p>No Data</p>
          </div>
        )}

      <AddProduct isOpen={showAddModal} onClose={() => setShowAddModal(false)} />
    </div>
  );
}

export default Admin;
