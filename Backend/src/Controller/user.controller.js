const generateOTP = require('../Utils/otp');
const User = require('../Model/user.model');
const sendMail = require('../Utils/mailer');
const uploadImage = require('../Utils/cloudinary');


const RegisterUser = async (req, res) => {
    const { name, username, email, password, phone, address, role, profilePicture } = req.body;

    try {
        const existingUser = await User.findOne({ $or: [{ username }, { email }, { phone }] });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const otp = generateOTP(6);
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
        const newUser = new User({ name, username, email, password, phone, address, role: role || 'user', otp, otpExpiry, isVerified: false, profilePicture });
        const refreshToken = newUser.generateRefreshToken();
        const accessToken = newUser.generateAccessToken();
        newUser.refreshToken = refreshToken;
        await newUser.save();
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
        await sendMail(user.email, 'Login OTP', `Your OTP for login is: ${otp}`);
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
    const { userId, } = req;
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

const AdminProfile = async (req, res) => {
    const { userId } = req.userId;
    const { email, password } = req.body;

    try {
        const user = await User.findById(userId).select('-password -refreshToken');

        if (email !== process.env.ADMIN_EMAIL && password !== process.env.ADMIN_PASSWORD) {
            return res.status(403).json({ message: 'Access denied' });
        }

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.role = 'admin';
        await user.save();

        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching admin profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const AddtoCart = async (req, res) => {
    const { userId } = req.userId;
    const { productId, quantity, size } = req.body;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const existingItem = user.cartData.find(item => item.productId === productId && item.size === size);
        if (existingItem) {
            existingItem.quantity += quantity; // Update quantity if item already exists
        } else {
            user.cartData.push({ productId, quantity, size }); // Add new item to cart
        }
        await user.save();
        res.status(200).json({ message: 'Item added to cart successfully', cartData: user.cartData });

    }
    catch (error) {
        console.error('Error adding item to cart:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const RemoveFromCart = async (req, res) => {
    const { userId } = req.userId;
    const { productId, size } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.cartData = user.cartData.filter(item => !(item.productId === productId && item.size === size));
        await user.save();
        res.status(200).json({ message: 'Item removed from cart successfully', cartData: user.cartData });

    } catch (error) {
        console.error('Error removing item from cart:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}



module.exports = { RegisterUser, LoginUser, LogoutUser, VerifyOTP, ResendOTP, Profile, uploadUrl, AdminProfile, AddtoCart, RemoveFromCart };