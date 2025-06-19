const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    phone: { type: String, required: true, unique: true, trim: true },
    address: { type: String, required: true, trim: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    profilePicture: { type: String, default: 'https://images.news9live.com/wp-content/uploads/2023/08/cropped-image-2082.png?w=900&enlarge=true' },
    otp: {
        type: String,
    },
    otpExpiry: {
        type: Date,
    },
    isVerified: { type: Boolean, default: false },
    cartData: { type: Array, default: [] },
    wishlistData: { type: Array, default: [] },
    refreshToken: { type: String, default: null },
}, { timestamps: true });

// Method to hash the password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified(passward)) { return next() }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
})

// Method to compare the password
userSchema.methods.comparePassword = async function (Passward) {
    return await bcrypt.compare(Passward, this.password);
}

// Method to generate JWT token
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign({ id: this._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_SECRET_EXPIRES });
}

// Method to generate access token
userSchema.methods.generateAccessToken = function () {
    return jwt.sign({ id: this._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_SECRET_EXPIRES });
}


module.exports = mongoose.model('User', userSchema);