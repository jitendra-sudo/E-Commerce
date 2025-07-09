import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, loginUser, verifyOtp } from '../ContextApi/AuthSlice';
import { toast } from 'react-toastify';
import TitleHeader from './titleHeader';
import { useNavigate } from 'react-router-dom';

function Login() {
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.auth);
    const defaultFormData = { name: '', username: '', email: '', password: '', phone: '', role: 'user' };
    const [formData, setFormData] = useState(defaultFormData);
    const [loginInput, setLoginInput] = useState({ username: '', password: '' });
    const [otp, setOtp] = useState('');
    const [showLogin, setShowLogin] = useState(true);
    const [showOTP, setShowOTP] = useState(false);
    const navigate = useNavigate()

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        const { name, username, email, password, phone } = formData;
        if (!name || !username || !email || !password || !phone) {
            toast.error("Please fill all fields.");
            return;
        }

        dispatch(registerUser(formData)).unwrap()
            .then(() => setShowOTP(true))
            .catch(() => toast.error("Registration failed"));
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!loginInput.username || !loginInput.password) {
            toast.error("Please fill all fields.");
            return;
        }

        dispatch(loginUser(loginInput)).unwrap()
            .then((res) => {
                const token = res?.accessToken;
                if (token) {
                    localStorage.setItem('token', token);
                    toast.success("Login successful");
                    navigate("/")
                } else {
                    toast.error("No token received");
                }
            })
            .catch(() => {
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
            toast.success("OTP verified successfully");
            setShowOTP(false);
            setShowLogin(true);
            setFormData(defaultFormData);
            navigate("/")
        } else {
            toast.error('Invalid OTP. Please try again.');
        }
    };

    const inputStyles = "w-full border text-[13px] rounded-md border-gray-300 px-3 py-2 focus:outline-none focus:border-blue-500";

    return (
        <div className="min-h-110 flex flex-col justify-between items-center  p-4">
            <div className='w-full  my-4'>
             {!showLogin && !showOTP && (
                <TitleHeader task1="Register" task2="Page" />
             )}

             {showLogin && !showOTP  && (
                <TitleHeader task1="login" task2="Page" />
             )}

             {showOTP && (
                <TitleHeader task1="Verify" task2="OTP" />
             )}
                     
            </div>
            <div className="rounded-xl border border-gray-300 shadow-lg p-6 w-full max-w-sm">
                {!showLogin && !showOTP && (
                    <>
                        <h2 className="text-2xl font-semibold mb-4 text-center">Register</h2>
                        <form className="space-y-4" onSubmit={handleRegister}>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" className={inputStyles} />
                            <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Username" className={inputStyles} />
                            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number" className={inputStyles} />
                            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className={inputStyles} />
                            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" className={inputStyles} />
                            <button type="submit" className="w-full bg-yellow-600 hover:bg-yellow-500 text-white py-2 rounded">
                                {loading ? "Loading..." : "Register"}
                            </button>
                        </form>
                        <p className="text-center mt-4 text-sm">Already have an account?{' '}
                            <button className="text-blue-600 hover:underline" onClick={() => setShowLogin(true)}>
                                Login
                            </button>
                        </p>
                    </>
                )}

                {showLogin && !showOTP && (
                    <>
                        <h2 className="text-2xl font-semibold mb-4 text-center">Login</h2>
                        <form className="space-y-4" onSubmit={handleLogin}>
                            <input type="text" name="username" value={loginInput.username} onChange={(e) => setLoginInput({ ...loginInput, username: e.target.value })} placeholder="Username / Email / Phone" className={inputStyles} />
                            <input type="password" name="password" value={loginInput.password} onChange={(e) => setLoginInput({ ...loginInput, password: e.target.value })} placeholder="Password" className={inputStyles} />
                            <button type="submit" className="w-full bg-yellow-600 hover:bg-yellow-500 text-white py-2 rounded">
                                {loading ? "Loading..." : "Login"}
                            </button>
                        </form>
                        <p className="text-center mt-4 text-sm">Don’t have an account?{' '}
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
                            <button type="submit" className="w-full bg-green-600 hover:bg-green-500 text-white py-2 rounded">
                                Verify OTP
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}

export default Login;
