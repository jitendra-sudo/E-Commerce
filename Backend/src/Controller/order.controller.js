const Order = require('../Model/order.model.js');
const Razorpay = require('../Utils/razorpay.js');
const stripe = require('../Utils/stripe.js');

const createOrder = async (req, res) => {
    const { products, totalAmount, shippingAddress, paymentMethod } = req.body;
    const userId = req.userId;
    try {
        const order = new Order({ userId, products, totalAmount, shippingAddress, paymentMethod });
        await order.save();
        res.status(201).json({ message: 'Order created successfully', order });
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}
const getUserOrders = async (req, res) => {
    const { userId } = req.userId;
    try {
        const orders = await Order.find(userId).populate('products.productId', 'name price image');
        res.status(200).json(orders);
    } catch (error) {
        console.error("Error fetching user orders:", error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('userId', 'name email').populate('products.productId', 'name price image');
        res.status(200).json(orders);
    } catch (error) {
        console.error("Error fetching all orders:", error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}
const updateOrderStatus = async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;

    try {
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        order.status = status;
        await order.save();
        res.status(200).json({ message: 'Order status updated successfully', order });
    }
    catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}
const deleteOrder = async (req, res) => {
    const { orderId } = req.params;

    try {
        const order = await Order.findByIdAndDelete(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
        console.error("Error deleting order:", error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}
const placeOrderStripe = async (req, res) => {
    const { products, totalAmount, shippingAddress } = req.body;

    try {
        const order = new Order({
            userId: req.userId,
            products,
            totalAmount,
            shippingAddress,
            paymentMethod: 'stripe'
        });

        const stripeSession = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: products.map(product => ({
                price_data: {
                    currency: 'INR',
                    product_data: {
                        name: product.productId.name,
                        images: [product.productId.image]
                    },
                    unit_amount: product.productId.price * 100
                },
                quantity: product.quantity
            })),
            mode: 'payment',
            success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/cancel`
        });

        if (!stripeSession) {
            return res.status(500).json({ message: 'Failed to create Stripe session' });
        }

        await order.save();
        res.status(201).json({ message: 'Order created successfully', order, stripeSession });
    } catch (error) {
        console.error("Error creating Stripe order:", error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}
const placeOrderRazorpay = async (req, res) => {
    const { products, totalAmount, shippingAddress } = req.body;

    try {
        const order = new Order({
            userId: req.userId,
            products,
            totalAmount,
            shippingAddress,
            paymentMethod: 'razorpay'
        });

        const options = {
            amount: totalAmount * 100,
            currency: 'INR',
            receipt: `receipt_${order._id}`,
            notes: {
                orderId: order._id.toString()
            }
        };

        const razorpayOrder = await Razorpay.orders.create(options);

        if (!razorpayOrder) {
            return res.status(500).json({ message: 'Failed to create Razorpay order' });
        }

        await order.save();
        res.status(201).json({ message: 'Order created successfully', order, razorpayOrder });
    } catch (error) {
        console.error("Error creating Razorpay order:", error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

module.exports = { createOrder, getUserOrders, getAllOrders, updateOrderStatus, deleteOrder, placeOrderRazorpay, placeOrderStripe };