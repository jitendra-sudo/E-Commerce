const mongoose = require('mongoose');


const orderSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [{ productId: { type:String , required: true }, quantity: { type: Number, default: 1 } }],
    totalAmount: { type: Number, required: true },
    shippingAddress: {
        name: { type: String, required: true },
        addressLine1: { type: String, required: true },
        addressLine2: { type: String },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zipCode: { type: String, required: true },
        country: { type: String, required: true }
    },
    paymentMethod: { type: String, enum: ['stripe', 'razorpay', 'COD'], required: true },
    status: { type: String, enum: ['Pending', 'Out for Delivery', 'Dispatched', 'Shipped', 'Delivered', 'Cancelled'], default: 'Pending' }
}, { timestamps: true });


module.exports = mongoose.model('Order', orderSchema);