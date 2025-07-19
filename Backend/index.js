// const express = require('express');
// require('dotenv').config();
// const cors = require('cors');
// const userRoutes = require('./src/Routes/user.routes.js');
// const productRoutes = require('./src/Routes/products.routes.js');
// const orderRoutes = require('./src/Routes/orders.routes.js');
// const connectDB = require('./src/Utils/db.js');
// const WishlistRoutes = require('./src/Routes/wishlist.routes.js');

// const app = express();
// app.use(cors({
//   origin: '*', 
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   credentials: true,
// }));
// app.use(express.json());
// app.use(express.static('public'));
// app.use('/api', userRoutes);
// app.use('/api/', productRoutes);
// app.use('/api', orderRoutes);
// app.use('/api', WishlistRoutes);

// app.listen(process.env.PORT || 5000, () => {
//     console.log(`Server is running on port ${process.env.PORT || 5000}`);
//     connectDB()
// });

const express = require('express');
const cluster = require('cluster');
const os = require('os');
require('dotenv').config();
const cors = require('cors');
const userRoutes = require('./src/Routes/user.routes.js');
const productRoutes = require('./src/Routes/products.routes.js');
const orderRoutes = require('./src/Routes/orders.routes.js');
const connectDB = require('./src/Utils/db.js');
const WishlistRoutes = require('./src/Routes/wishlist.routes.js');

const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
  console.log(`Master ${process.pid} is running`);

  // Fork workers (equal to number of CPUs)
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // Optional: Restart worker on exit
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died. Spawning a new one...`);
    cluster.fork();
  });

} else {
  const app = express();

  app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  }));

  app.use(express.json());
  app.use(express.static('public'));

  app.use('/api', userRoutes);
  app.use('/api', productRoutes);
  app.use('/api', orderRoutes);
  app.use('/api', WishlistRoutes);

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Worker ${process.pid} is running on port ${PORT}`);
    connectDB();
  });
}
