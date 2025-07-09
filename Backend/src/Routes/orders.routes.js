const { createOrder, getUserOrders, getAllOrders, updateOrderStatus, deleteOrder, placeOrderRazorpay, placeOrderStripe } = require('../Controller/order.controller.js');
const express = require('express');
const verifyToken = require('../Middleware/auth.middleware.js');
const router = express.Router();

router.post('/placeorder', verifyToken, createOrder);
router.get('/order', verifyToken, getUserOrders);
router.get('/getallorders', verifyToken, getAllOrders);
router.put('/update-order/:id', verifyToken, updateOrderStatus);
router.delete('/cancel-order/:id', deleteOrder);
router.post('/place-order-razorpay', verifyToken, placeOrderRazorpay);
router.post('/place-order-stripe', verifyToken, placeOrderStripe);

module.exports = router;
