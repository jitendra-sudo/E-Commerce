import React, { useState } from 'react';
import Api from './Api';
import { toast } from 'react-toastify';

function Register({ showModal, setShowModal, setShowLogin }) {
    const defaultFormData = { name: '', username: '', email: '', password: '', phone: '', role: 'user' };
    const [formData, setFormData] = useState(defaultFormData);
    const [showOTP, setShowOTP] = useState(false);
    const [otp, setOtp] = useState('');
    const [otpError, setOtpError] = useState('');
    const [loading, setLoading] = useState(false);


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.username || !formData.email || !formData.password || !formData.phone) {
            toast.error("Please fill all fields.");
            return;
        }

        setLoading(true);

        try {
            const response = await Api.post('/register', formData);
            console.log('Registration response:', response.data);

            toast.success(response.data.message || "Registered successfully!");
            setShowOTP(true);
        } catch (error) {
            const message = error.response?.data?.message || error.message || "Something went wrong";
            toast.error(message);
            console.error("Frontend registration error:", message);
        } finally {
            setLoading(false);
        }
    };


    const handleOtpVerify = async (e) => {
        e.preventDefault();
        try {
            if (!otp) {
                toast.error('OTP is required');
                return;
            }
            const response = await Api.post('/verify-otp', { otp, phone: formData.phone });
            console.log('OTP verification response:', response.data);
            if (response.data.success) {
                toast.success("OTP verified successfully!");
                setShowModal(false);
                setShowLogin(true);
            } else {
                setOtpError('Invalid OTP. Please try again.');
            }

        } catch (error) {
            console.error('Error during OTP verification:', error);
        }
        console.log('Verifying OTP:', otp);
        setShowModal(false);
        setShowOTP(false);
        setFormData(defaultFormData);
    };

    return (
        <>
            {showModal && (
                <div
                    className="fixed inset-0 bg-black/10 backdrop-blur-sm flex justify-center items-center z-50"
                    onClick={() => setShowModal(false)}
                >
                    <div className="bg-white rounded-xl shadow-xl p-6 w-[70%] max-w-sm relative" onClick={(e) => e.stopPropagation()}      >
                        {!showOTP ? (
                            <>
                                <h2 className="text-2xl font-semibold mb-4 text-center">Register</h2>
                                <form className="space-y-4" onSubmit={handleRegister}>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Full Name"
                                        className="w-full border text-[12px] rounded-md border-gray-300 px-3 py-2 focus:outline-none focus:border-blue-500" />
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        placeholder="Username"
                                        className="w-full border text-[12px] rounded-md border-gray-300 px-3 py-2 focus:outline-none focus:border-blue-500" />

                                    <input
                                        type="text"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="Phone Number"
                                        className="w-full border text-[12px] rounded-md border-gray-300 px-2 py-2 focus:outline-none focus:border-blue-500" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Email"
                                        className="w-full border text-[12px] rounded-md border-gray-300 px-3 py-2 focus:outline-none focus:border-blue-500" />
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Password"
                                        className="w-full border text-[12px] rounded-md border-gray-300 px-3 py-2 focus:outline-none focus:border-blue-500" />

                                    <button
                                        type="submit"
                                        className="w-full bg-yellow-600 hover:bg-amber-500 text-white py-2 rounded"
                                    >
                                        {loading ? <span className="ml-2 spinner-border spinner-border-sm"></span> : "Register"}
                                    </button>
                                </form>
                                <p className="text-center font-sans mt-4">
                                    Already have an account?{' '}
                                    <button
                                        className="text-blue-600 hover:underline"
                                        onClick={() => {
                                            setShowModal(false);
                                            setShowLogin(true);
                                        }}
                                    >
                                        Login
                                    </button>
                                </p>
                            </>
                        ) : (
                            <>
                                <h2 className="text-xl font-semibold text-center mb-4">Verify OTP</h2>
                                <form className="space-y-4" onSubmit={handleOtpVerify}>
                                    <input
                                        type="text"
                                        name="otp"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        placeholder="Enter OTP"
                                        className="w-full border text-[12px] rounded-md border-gray-300 px-3 py-2 focus:outline-none focus:border-blue-500"
                                    />
                                    <button
                                        type="submit"
                                        className="w-full bg-green-600 text-white py-2 rounded"
                                    >
                                        Verify OTP
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

export default Register;
