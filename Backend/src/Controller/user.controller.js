const generateOTP = require('../Utils/otp');
const User = require('../Model/user.model');
const sendMail = require('../Utils/mailer');
const uploadImage = require('../Utils/cloudinary');


const RegisterUser = async (req, res) => {
    const { name, username, email, password, phone, address, role, profilePicture } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ username }, { email }, { phone }] });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Generate OTP
        const otp = generateOTP(6);
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

        // Create user
        const newUser = new User({
            name,
            username,
            email,
            password,
            phone,
            address,
            role: role || 'user',
            otp,
            otpExpiry,
            isVerified: false,
            profilePicture
        });

        // Generate tokens
        const refreshToken = newUser.generateRefreshToken();
        const accessToken = newUser.generateAccessToken();
        newUser.refreshToken = refreshToken;

        await newUser.save();

        // Send OTP email
        
        await sendMail(email, 'Verify your email - OTP', `Your OTP is: ${otp}`);

        res.status(201).json({
            message: 'User registered successfully. Please verify your email.',
            refreshToken,
            accessToken,
        });

    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const LoginUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        // Find user by username
        const user = await User.findOne({ $or: [{ username }, { email }, { phone }] }).select('+password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate OTP
        const otp = generateOTP(6);
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);


        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        // Generate tokens
        const refreshToken = user.generateRefreshToken();
        const accessToken = user.generateAccessToken();
        user.refreshToken = refreshToken;
        user.otp = otp;
        user.otpExpiry = otpExpiry;
        // Send OTP email
        await sendMail(user.email, 'Login OTP', `Your OTP for login is: ${otp}`);
        // Save user with new tokens and OTP

        user.isVerified = false;
        await user.save();
        res.status(200).json({ message: 'Login successful', refreshToken, accessToken });

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

const ResendOTP = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const otp = generateOTP();

        user.otp = otp;
        user.otpExpiry = Date.now() + 10 * 60 * 1000;
        await user.save();

        await sendMail(email, 'Your OTP Code', `Your OTP code is: ${otp}`);

        res.status(200).json({ message: 'OTP resent successfully' });
    } catch (error) {
        console.error('Error resending OTP:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


const Profile = async (req, res) => {
    const { userId ,  } = req;
    try {
        const user = await User.findById(userId).select('-password -refreshToken');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
    }


const uploadUrl = async (req, res) => {
    try {
        res.status(200).json({ imageUrl: req.imageUrl });
    } catch (error) {
        console.error('Error in uploadUrl:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


module.exports = {  RegisterUser,  LoginUser,  LogoutUser,  VerifyOTP,  ResendOTP , Profile , uploadUrl };