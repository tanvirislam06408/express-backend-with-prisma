import { Router } from 'express';
import prisma from '../lib/prisma.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authenticate);


router.post('/', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = await prisma.user.create({
            data: { name, email, password }
        });
        res.status(201).json({ success: true, data: user });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.status(200).json({ success: true, data: users });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;