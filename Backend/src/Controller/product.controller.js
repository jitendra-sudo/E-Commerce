const Product = require('../Model/product.model.js');

const AddProduct = async (req, res) => {
    const { name, description, price, image, category, subcategory, sizes, bestseller, newarrival } = req.body;

    try {
        const product = new Product({
            userId: req.userId,
            name,
            description,
            price,
            image,
            category,
            subcategory,
            sizes,
            bestseller: bestseller || false,
            newarrival: newarrival || true
        });

        await product.save();
        res.status(201).json({ message: 'Product added successfully', product });
    } catch (error) {
        console.error("Error adding product:", error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.status(200).json(products);

    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

const removeProduct = async (req, res) => {
    const { productId } = req.params;
    try {
        const product = await Product.findByIdAndDelete(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product removed successfully' });
    } catch (error) {
        console.error("Error removing product:", error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

const singleProduct = async (req, res) => {
    const { productId } = req.params;
    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};


const UserProducts = async (req, res) => {
    const { userId } = req.userId;
    try {
        const products = await Product.find({ userId }).sort({ createdAt: -1 });
        if (!products || products.length === 0) {
            return res.status(404).json({ message: 'No products found for this user' });
        }
        res.status(200).json(products);
    } catch (error) {
        console.error("Error fetching user products:", error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}


module.exports = { AddProduct, getAllProducts, removeProduct, singleProduct, UserProducts };