import React, { useState } from 'react';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import Api from '../compound/Api';
import { FiX } from "react-icons/fi";

Modal.setAppElement('#root');

function AddProduct({ isOpen, onClose }) {
  const [formData, setFormData] = useState({ name: '', description: '', price: '', image: [], category: '', subcategory: '', brand: '', sizes: [], bestseller: false, newarrival: true, });

  const [sizeInput, setSizeInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAddSize = () => {
    if (sizeInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        sizes: [...prev.sizes, sizeInput],
      }));
      setSizeInput('');
    }
  };

  const handleUpload = async (files) => {
    if (!files || files.length === 0) return;
    setImgLoading(true);
    try {
      const uploadedUrls = [];
      for (let i = 0; i < files.length; i++) {
        const formDataUpload = new FormData();
        formDataUpload.append('file', files[i]);
        const res = await Api.post('/upload', formDataUpload, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        const imageUrl = res?.data?.imageUrls;
        if (imageUrl && Array.isArray(imageUrl)) {
          uploadedUrls.push(...imageUrl);
        }
      }
      setFormData((prev) => ({
        ...prev,
        image: [...prev.image, ...uploadedUrls],
      }));
      toast.success('Image(s) uploaded successfully');
    } catch (err) {
      toast.error('Image upload failed');
    } finally {
      setImgLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('Admintoken');
      const res = await Api.post('/add', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Product added successfully');
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImage = (indexToDelete) => {
    setFormData((prev) => ({
      ...prev,
      image: prev.image.filter((_, index) => index !== indexToDelete),
    }));
  };


  const subCategories = ['T-Shirts', 'Shirts', 'Sweatshirts', 'Jackets', 'Jeans', 'Trousers', 'Shorts', 'Joggers', 'Tops', 'Kurtis', 'Blouses', 'Leggings', 'Skirts', 'Dresses', 'Sarees', 'Salwar Suits', 'Lehengas', 'Lingerie', 'Nightwear', 'Casual Shoes', 'Sports Shoes', 'Flats', 'Heels', 'Sneakers', 'Belts', 'Watches', 'Jewelry', 'Backpacks', 'Handbags'];
  const categories = ["Men", "Women", "Kids", "Footwear", "Accessories", "Home"];


  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} contentLabel="Add Product" className="bg-white p-6 rounded-xl w-full max-w-2xl mx-auto border border-gray-300 mt-10 shadow-2xl outline-none " overlayClassName="fixed inset-0  bg-black/10 backdrop-blur-sm  flex justify-center items-start z-50">
      <h2 className="text-2xl font-bold mb-6 text-start text-gray-800">Add New Product</h2>
      <div className='h-[70vh] overflow-y-auto overflow-x-hidden p-1'>
        <form className="grid grid-cols-1 gap-4" onSubmit={handleSubmit}>
          <input className="input" placeholder="Name" name="name" value={formData.name} onChange={handleChange} required />
          <textarea className="input" placeholder="Description" name="description" value={formData.description} onChange={handleChange} required />
          <div className='flex gap-4'>
            <input className="input" type="number" placeholder="Price" name="price" value={formData.price} onChange={handleChange} required />
            <input className="input" placeholder="Brand" name="brand" value={formData.brand} onChange={handleChange} required />
          </div>
          <div className='flex gap-4'>
            <select name="category" value={formData.category} onChange={handleChange} className="input overflow-y-auto" required    >
              <option value="" disabled>Select Category</option>
              {categories?.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <select name="subcategory" onChange={handleChange} className="input" >
              <option value="" disabled>Select Subcategory</option>
              {subCategories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center py-2">
              <label htmlFor="image-upload" className="font-semibold text-sm">    Upload Image  </label>
              <input id="image-upload" type="file" accept="image/*" multiple onChange={(e) => handleUpload(e.target.files)} className="hidden" />
              <label
                htmlFor="image-upload" className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition text-sm"   >
                {imgLoading ? "uploading..." : 'Add Image'}
              </label>
            </div>
            <p className="text-xs text-gray-500">Uploaded: {formData.image.length} image(s)</p>
            <div className="flex gap-1 flex-wrap p-1">
              {formData.image.map((url, index) => (
                <div key={index} className="relative">
                  <img
                    src={url}
                    alt={`uploaded-${index}`}
                    className="h-20 w-20 object-cover rounded-md border border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteImage(index)}
                    className="absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:bg-red-100"
                  >
                    <FiX className="text-red-500 w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

          </div>


          {/* Add Size */}
          <div>
            <label className="font-semibold text-sm">Sizes</label>
            <div className="flex gap-2 mt-1">
              <input
                className="input flex-1"
                placeholder="Size (e.g. S, M, L)"
                value={sizeInput}
                onChange={(e) => setSizeInput(e.target.value)}
              />
              <button type="button" className="btn-blue" onClick={handleAddSize}>Add</button>
            </div>
            <div className="text-xs text-gray-500 mt-1">Sizes: {formData.sizes.join(', ')}</div>
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2">
              <input type="checkbox" name="bestseller" checked={formData.bestseller} onChange={handleChange} />
              <span className="text-sm text-gray-700">Bestseller</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" name="newarrival" checked={formData.newarrival} onChange={handleChange} />
              <span className="text-sm text-gray-700">New Arrival</span>
            </label>
          </div>

          <div className="flex justify-end gap-4 mt-4">
            <button type="button" onClick={onClose} className="btn-gray">Cancel</button>
            <button type="submit" className="btn-green">
              {loading ? 'Saving...' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

export default AddProduct;
