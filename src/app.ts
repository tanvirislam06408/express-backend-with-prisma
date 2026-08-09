import express from 'express';
import cors from 'cors';
import userRoutes from './routes/user.routes.js'
import authRoutes from './services/auth/auth.route.js'

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Server is running successfully and Prisma is connected! 🚀');
});

// auth routes
app.use('/api/auth', authRoutes)


app.use('/api/users', userRoutes);

export default app;