const {  RegisterUser,AddressList, AddressDelete,Address,LoginUser,  LogoutUser,  VerifyOTP,  ResendOTP , Profile, uploadUrl, AdminProfile, AddtoCart, RemoveFromCart } = require('../Controller/user.controller.js');
const express = require('express');
const verifyToken = require('../Middleware/auth.middleware.js');
const router = express.Router();
const upload = require('../Utils/cloudinary.js');

router.post('/register', RegisterUser);
router.post('/login', LoginUser);
router.post('/logout', verifyToken, LogoutUser);
router.post('/verify-otp', VerifyOTP);  
router.post('/resend-otp', ResendOTP);
router.get('/profile', verifyToken,  Profile);
router.post('/upload', upload.any(), uploadUrl);
router.post('/admin', verifyToken, AdminProfile);
router.post('/add-to-cart', verifyToken, AddtoCart);
router.post('/remove-from-cart', verifyToken, RemoveFromCart);
router.post('/address', verifyToken, Address);
router.get('/address-list', verifyToken, AddressList); 
router.delete('/address-delete/:id', verifyToken, AddressDelete);

module.exports = router; 