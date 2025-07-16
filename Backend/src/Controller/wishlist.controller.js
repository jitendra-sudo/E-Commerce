const Wishlist = require('../Model/wishlist.model.js');

const addToWishlist = async (req, res) => {
  const { id } = req.body;
  const userId = req.userId;

  try {
    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      wishlist = new Wishlist({ userId, products: [id] });
      await wishlist.save();
      return res.status(200).json({ message: 'Wishlist added successfully', wishlist });
    }

    const index = wishlist.products.findIndex((productId) => productId.toString() === id);

    if (index !== -1) {
      wishlist.products.splice(index, 1);
      await wishlist.save();
      return res.status(200).json({ message: 'Wishlist removed successfully', wishlist });
    } else {
      wishlist.products.push(id);
      await wishlist.save();
      return res.status(200).json({ message: 'Wishlist added successfully', wishlist });
    }

  } catch (error) {
    res.status(500).json({
      message: 'Internal server error',
      error: error.message,
    });
  }
};




const getWishlist = async (req, res) => {
  const userId = req.userId;

  try {
    const wishlist = await Wishlist.findOne({ userId }).populate('products', 'name price image');

    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }

    res.status(200).json(wishlist);
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};


const removeFromWishlist = async (req, res) => {
  const id = req.params?.id;
  const userId = req.userId;

  try {
    const wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }

    wishlist.products = wishlist.products.filter(p => p.toString() !== id);
    await wishlist.save();

    res.status(200).json({ message: 'Product removed from wishlist successfully', wishlist });
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

module.exports = { addToWishlist, getWishlist, removeFromWishlist };
