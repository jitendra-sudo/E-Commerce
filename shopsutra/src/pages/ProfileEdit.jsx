import React, { useState, useEffect, useRef } from 'react';
import Api from '../compound/Api';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaCamera } from 'react-icons/fa';

function ProfileEdit() {
  const location = useLocation();
  const navigate = useNavigate();
  const userData = location.state?.userData;

  const [form, setForm] = useState({ name: '', phone: '', profilePicture: '', });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef();

  useEffect(() => {
    if (userData) {
      setForm({
        name: userData.name || '',
        phone: userData.phone || '',
        profilePicture: userData.profilePicture || '',
      });
    }
  }, [userData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpload = async (file) => {
    if (!file) return null;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await Api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Image uploaded successfully');
      setForm({ ...form, profilePicture: res?.data?.imageUrls[0] });
      return res?.data?.imageUrls[0];
    } catch (err) {
      toast.error('Image upload failed');
      return null;
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const uploadedUrl = await handleUpload(file);
      if (uploadedUrl) {
        setForm((prev) => ({ ...prev, profilePicture: uploadedUrl }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      await Api.put(
        '/profile-edit',
        {
          name: form.name,
          phone: form.phone,
          profilePicture: form.profilePicture,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success('Profile updated successfully');
      navigate('/profile');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto mt-10 bg-white p-6 rounded-xl shadow space-y-6"
    >
      <h2 className="text-2xl font-bold text-gray-800">Edit Profile</h2>

      {/* Profile Image Upload Section */}
      <div className="relative w-24 h-24 mx-auto">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={fileInputRef}
          className="hidden"
        />

        <div
          className="w-full h-full rounded-full overflow-hidden border cursor-pointer group"
          onClick={() => fileInputRef.current?.click()}
        >
          <img
            src={
              imageFile
                ? URL.createObjectURL(imageFile)
                : form.profilePicture
            }
            alt="Preview"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
            <FaCamera className="text-white text-lg" />
          </div>
        </div>
      </div>

      {/* Name Field */}
      <div>
        <label className="block mb-1 text-gray-600">Name</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 p-2 rounded-md"
        />
      </div>

      {/* Phone Field */}
      <div>
        <label className="block mb-1 text-gray-600">Phone</label>
        <input
          type="text"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 p-2 rounded-md"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md"
      >
        {loading ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  );
}

export default ProfileEdit;
