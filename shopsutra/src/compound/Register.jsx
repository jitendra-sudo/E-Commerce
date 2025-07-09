import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, loginUser, verifyOtp } from '../ContextApi/AuthSlice';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function Register({ showModal, setShowModal }) {
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.auth);
    const defaultFormData = { name: '', username: '', email: '', password: '', phone: '', role: 'user' };
    const [formData, setFormData] = useState(defaultFormData);
    const [loginInput, setLoginInput] = useState({ username: '', password: '' });
    const [otp, setOtp] = useState('');
    const [showLogin, setShowLogin] = useState(true);
    const token = localStorage.getItem('token')
    const [showOTP, setShowOTP] = useState(false)
    const navigate = useNavigate()


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.username || !formData.email || !formData.password || !formData.phone) {
            toast.error("Please fill all fields.");
            return;
        }
        dispatch(registerUser(formData)).unwrap()
        .then(() =>
            setShowOTP(true)
        )
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!loginInput.username || !loginInput.password) {
            toast.error("Please fill all fields.");
            return;
        }
        dispatch(loginUser(loginInput)).unwrap()
            .then((res) => {
                let accessToken = res?.accessToken;
                console.log(accessToken);
                if (accessToken) {
                    localStorage.setItem('token', res?.accessToken);
                    setShowModal(false);
                } else {
                    toast.error("No token received");
                }
            })
            .catch((err) => {
                toast.error("Login failed");
            });

    };


    const handleOtpVerify = async (e) => {
        e.preventDefault();
        if (!otp) {
            toast.error('OTP is required');
            return;
        }
        const result = await dispatch(verifyOtp({ otp, email: formData.email })).unwrap();
        if (result.success) {
            setShowModal(false);
            setShowLogin(true);
        } else {
            toast.error('Invalid OTP. Please try again.');
        }
    };


    const inputStyles = "w-full border text-[12px] rounded-md border-gray-300 px-3 py-2 focus:outline-none focus:border-blue-500";
    return (
        <>
            {showModal && (
                <div
                    className="fixed inset-0 bg-black/10 backdrop-blur-sm flex justify-center items-center z-50"
                    onClick={() => setShowModal(false)}
                >
                    <div className="bg-white rounded-xl shadow-xl p-6 w-[90%] md:w-[70%] max-w-sm relative" onClick={(e) => e.stopPropagation()}      >
                        {!showLogin && !showOTP && (
                            <>
                                <h2 className="text-2xl font-semibold mb-4 text-center">Register</h2>
                                <form className="space-y-4" onSubmit={handleRegister}>
                                    <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" className={inputStyles} />
                                    <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Username" className={inputStyles} />
                                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number" className={inputStyles} />
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className={inputStyles} />
                                    <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" className={inputStyles} />
                                    <button type="submit" className="w-full bg-yellow-600 hover:bg-amber-500 text-white py-2 rounded">
                                        {loading ? <span>Loading...</span> : "Register"}
                                    </button>
                                </form>
                                <p className="text-center font-sans mt-4">Already have an account?{' '} <button className="text-blue-600 hover:underline" onClick={() => setShowLogin(true)} > Login </button>       </p>
                            </>
                        )}

                        {showLogin && (
                            <>
                                <h2 className="text-2xl font-semibold mb-4 text-center">Login</h2>
                                <form className="space-y-4" onSubmit={handleLogin}>
                                    <input type="text" name="username" value={loginInput?.username} onChange={(e) => setLoginInput({ ...loginInput, username: e.target.value })} placeholder="Username or Email or Phone" className={inputStyles} />
                                    <input type="password" name="password" value={loginInput?.password} onChange={(e) => setLoginInput({ ...loginInput, password: e.target.value })} placeholder="Password" className={inputStyles} />
                                    <button type="submit" className="w-full bg-yellow-600 hover:bg-amber-500 text-white py-2 rounded"> {loading ? <span>Loading...</span> : "Login"}</button>
                                </form>
                                <p className="text-center font-sans mt-4">
                                    Don’t have an account?{' '}
                                    <button className="text-blue-600 hover:underline" onClick={() => setShowLogin(false)}>
                                        Register
                                    </button>
                                </p>
                            </>
                        )}


                        {showOTP && (
                            <>
                                <h2 className="text-xl font-semibold text-center mb-4">Verify OTP</h2>
                                <form className="space-y-4" onSubmit={handleOtpVerify}>
                                    <input type="text" name="otp" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP" className={inputStyles} />
                                    <button type="submit" className="w-full bg-green-600 text-white py-2 rounded"    >
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
