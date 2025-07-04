const mongoose = require('mongoose');
const wishlistSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [{  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, default: 1  , }, 
    }]
}, { timestamps: true });

module.exports = mongoose.model('Wishlist', wishlistSchema);