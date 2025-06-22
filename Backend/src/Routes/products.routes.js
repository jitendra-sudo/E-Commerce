const { AddProduct, getAllProducts, removeProduct, singleProduct, UserProducts } = require('../Controller/product.controller.js');
const express = require('express');
const { verifyToken } = require('../Middleware/auth.middleware');

const router = express.Router();

router.post('/add', verifyToken, AddProduct);
router.get('/', getAllProducts);
router.delete('/:productId', verifyToken, removeProduct);
router.post('/single', verifyToken, singleProduct);
router.get('/user-products', verifyToken, UserProducts);

module.exports = router;