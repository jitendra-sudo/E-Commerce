const { addToWishlist, getWishlist, removeFromWishlist } = require('../Controller/wishlist.controller.js');
const express = require('express');
const router = express.Router();
const  verifyToken  = require('../Middleware/auth.middleware');

router.post('/addWishlist', verifyToken, addToWishlist);
router.get('/wishlist', verifyToken, getWishlist);
router.delete('/removewishlist/:id', verifyToken, removeFromWishlist);

module.exports = router;
