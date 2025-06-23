const express = require('express');
require('dotenv').config();
const cors = require('cors');
const userRoutes = require('./src/Routes/user.routes.js');
const productRoutes = require('./src/Routes/products.routes.js');
const orderRoutes = require('./src/Routes/orders.routes.js');
const connectDB = require('./src/Utils/db.js');
const WishlistRoutes = require('./src/Routes/wishlist.routes.js');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/api', userRoutes);
app.use('/api/', productRoutes);
app.use('/api', orderRoutes);
app.use('/api', WishlistRoutes);

app.listen(process.env.PORT || 5000, () => {
    console.log(`Server is running on port ${process.env.PORT || 5000}`);
    connectDB()
});