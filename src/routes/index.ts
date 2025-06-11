import express from 'express';
import productRoutes from './productRoutes';
import userRoutes from './userRoutes';

const router = express.Router();

router.use('/products', productRoutes);
router.use('/auth', userRoutes);

export default router;
