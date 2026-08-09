import express from 'express';
import cors from 'cors';
import userRoutes from './routes/user.routes.js'
import authRoutes from './services/auth/auth.route.js'
import categoryRoutes from './routes/category.routes.js'
import productRoutes from './routes/product.routes.js'
import orderRoutes from './routes/order.routes.js'
import reviewRoutes from './routes/review.routes.js'


const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Server is running successfully and Prisma is connected! 🚀');
});

// auth routes
app.use('/api/auth', authRoutes)

app.use('/api/users', userRoutes);

// category
app.use("/api/categories", categoryRoutes);
// products
app.use("/api/products", productRoutes);
// orders
app.use("/api/orders", orderRoutes);
// reviews
app.use("/api/reviews", reviewRoutes);
export default app;