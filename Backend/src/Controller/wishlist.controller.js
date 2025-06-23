const Wishlist = require('../Model/Wishlist.model.js');

const addToWishlist = async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.userId;

    try {
        let wishlist = await Wishlist.findOne({ userId });

        if (!wishlist) {
            wishlist = new Wishlist({ userId, products: [] });
        }

        const existingProductIndex = wishlist.products.findIndex(p => p.productId.toString() === productId);
        if (existingProductIndex > -1) {
            wishlist.products[existingProductIndex].quantity += quantity;
        } else {
            wishlist.products.push({ productId, quantity });
        }
        await wishlist.save();
        res.status(200).json({ message: 'Product added to wishlist successfully', wishlist });
    } catch (error) {
        console.error("Error adding to wishlist:", error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

const getWishlist = async (req, res) => {
    const userId = req.userId;

    try {
        const wishlist = await Wishlist.findOne({ userId }).populate('products.productId', 'name price image');
        if (!wishlist) {
            return res.status(404).json({ message: 'Wishlist not found' });
        }
        res.status(200).json(wishlist);
    } catch (error) {
        console.error("Error fetching wishlist:", error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}


const removeFromWishlist = async (req, res) => {
    const { productId } = req.params;
    const userId = req.userId;

    try {
        const wishlist = await Wishlist.findOne({ userId });
        if (!wishlist) {
            return res.status(404).json({ message: 'Wishlist not found' });
        }
        wishlist.products = wishlist.products.filter(p => p.productId.toString() !== productId);
        await wishlist.save();
        res.status(200).json({ message: 'Product removed from wishlist successfully', wishlist });
    } catch (error) {
        console.error("Error removing from wishlist:", error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

module.exports = { addToWishlist, getWishlist, removeFromWishlist };