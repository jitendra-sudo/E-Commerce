const generateOTP = require('../Utils/otp');
const User = require('../Model/user.model');


const RegisterUser = async (req, res) => {
    const { name, username, email, password, phone, address, role, profilePicture } = req.body;
    try {
        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ username }, { email }, { phone }] });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const otp = generateOTP(6); 
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
        const newUser = new User({ name, username, email, password, phone, address, role: role, otp, otpExpiry,  isVerified: false || 'user', profilePicture });
        const refreshToken = newUser.generateRefreshToken();
        const accessToken = newUser.generateAccessToken();
        newUser.refreshToken = refreshToken;
        await newUser.save();
        res.status(201).json({
            message: 'User registered successfully',
            refreshToken,
            accessToken,
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

const LoginUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        // Find user by username
        const user = await User.findOne({ $or: [{ username }, { email }, { phone }] }).select('+password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        // Generate tokens
        const refreshToken = user.generateRefreshToken();
        const accessToken = user.generateAccessToken();
        user.refreshToken = refreshToken;
        await user.save();
        res.status(200).json({
            message: 'Login successful',
            refreshToken,
            accessToken
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}
const LogoutUser = async (req, res) => {
    const { userId } = req;
    try {
         const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }                       
        user.refreshToken = null;
        await user.save();  
        res.status(200).json({ message: 'Logout successful' });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
    }




const VerifyOTP = async (req, res) => {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.otp !== otp || user.otpExpiry < Date.now()) {
        return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();
    res.status(200).json({ message: 'OTP verified successfully' });
};


