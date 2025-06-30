const generateOTP = require('../Utils/otp');
const User = require('../Model/user.model');
const sendMail = require('../Utils/mailer');
const uploadImage = require('../Utils/cloudinary');
const tempUserStore = require('../Utils/tempUserStore');


const RegisterUser = async (req, res) => {
    const { name, username, email, password, phone, address, role } = req.body;

    try {
        const existingUser = await User.findOne({ $or: [{ username }, { email }, { phone }] });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const otp = generateOTP(6);
        const otpExpiry = Date.now() + 10 * 60 * 1000;

        tempUserStore.set(email, { name, username, email, password, phone, address, role: role || 'user', otp, otpExpiry, });
        await sendMail(email, 'Verify your email - OTP', `Your OTP is: ${otp}`);
        res.status(200).json({ message: 'OTP sent to your email' });

    } catch (error) {
        console.error('OTP Request Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


const LoginUser = async (req, res) => {
    const { username, email, phone, password } = req.body;
    try {
        const user = await User.findOne({ $or: [{ username }, { email }, { phone }] });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const refreshToken = user.generateRefreshToken();
        const accessToken = user.generateAccessToken();
        user.refreshToken = refreshToken;

        await user.save();

        res.status(200).json({ message: 'Login successful', accessToken });
    } catch (error) {
        console.error('Login error:', error); 
        res.status(500).json({ message: 'Internal server error' });
    }
};


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

    const storedUser = tempUserStore.get(email);

    if (!storedUser) {
        return res.status(400).json({ message: 'No OTP requested for this email' });
    }

    if (storedUser.otp !== otp || storedUser.otpExpiry <= Date.now()) {
        return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    try {
        const newUser = new User({
            name: storedUser.name,
            username: storedUser.username,
            email: storedUser.email,
            password: storedUser.password,
            phone: storedUser.phone,
            address: storedUser.address,
            role: storedUser.role,
            isVerified: true,
        });

        const refreshToken = newUser.generateRefreshToken();
        const accessToken = newUser.generateAccessToken();
        newUser.refreshToken = refreshToken;

        await newUser.save();

        tempUserStore.delete(email);

        res.status(201).json({
            message: 'OTP verified, user registered successfully',
            refreshToken,
            accessToken,
        });

    } catch (error) {
        console.error('Verify OTP Error:', error);
        res.status(500).json({ message: 'Failed to register user' });
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
            existingItem.quantity += quantity;
        } else {
            user.cartData.push({ productId, quantity, size });
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


module.exports = { RegisterUser, LoginUser, LogoutUser, VerifyOTP, ResendOTP, Profile, uploadUrl, AdminProfile, AddtoCart, RemoveFromCart };