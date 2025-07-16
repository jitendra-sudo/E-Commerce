import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaEdit } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { fetchProfile } from '../ContextApi/AuthSlice'

const Profile = () => {
    const dispatch = useDispatch();
    const { user, loading, error } = useSelector((state) => state.auth);
    const navigate = useNavigate()

    useEffect(() => {
        dispatch(fetchProfile())
    }, [dispatch])

    if (loading) return <div className="text-center mt-10 text-blue-600">Loading...</div>;
    if (error) return <div className="text-center mt-10 text-red-600">Error: {error}</div>;

    return (
        <div className='min-h-100 p-8'>
            <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg border border-gray-300 relative">

                <div className="absolute right-4 top-4">
                    <FaEdit onClick={() => navigate('/profile-edit', { state: { userData: user } })} />
                </div>
                <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                    <img
                        src={user?.profilePicture}
                        alt="Profile"
                        className="w-32 h-32 rounded-full object-cover border-4 border-blue-400"
                    />
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold text-gray-800">{user?.name}</h2>
                        <p className="text-sm text-gray-600">@{user?.username}</p>
                        <p className="mt-2 text-gray-700">Email: {user?.email}</p>
                        <p className="text-gray-700">Phone: {user?.phone}</p>
                        <p className="text-sm text-gray-500 mt-2">
                            Account Created: {new Date(user?.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>

                {/* Address Section */}
                <div className="mt-8">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Saved Addresses</h3>
                    {user?.address?.length > 0 ? (
                        user.address.map((addr, idx) => (
                            <div key={addr.id || idx} className="p-4 border rounded-lg mb-4 bg-gray-50">
                                <p className="text-gray-700">{addr.street}, {addr.city}, {addr.state}</p>
                                <p className="text-gray-700">{addr.pincode}, {addr.country}</p>
                                <p className="text-gray-600">Phone: {addr.phonenumber}</p>
                                <p className="text-gray-600">Email: {addr.email}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">No addresses saved.</p>
                    )}
                </div>
            </div>
        </div>

    );
};

export default Profile;
