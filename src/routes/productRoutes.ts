import express from 'express';
import multer from 'multer';
import path from 'path';
import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController';
import { validateProductInput } from '../middleware/validation';
import { isAuthenticated, isAdmin } from '../middleware/auth';
import { upload, handleMulterError } from '../middleware/upload';
import { ValidationError } from '../utils/errors';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const validateProductId = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const { id } = req.params;
  if (!id || id === 'undefined') {
    throw new ValidationError('Product ID is required');
  }
  next();
};

router.post(
  '/',
  isAuthenticated,
  isAdmin,
  upload.single('image'),
  handleMulterError,
  validateProductInput,
  createProduct
);
router.get('/', getProducts);
router.get('/:id', validateProductId, getProduct);
router.put(
  '/:id',
  isAuthenticated,
  isAdmin,
  validateProductId,
  upload.single('image'),
  handleMulterError,
  validateProductInput,
  updateProduct
);
router.delete(
  '/:id',
  isAuthenticated,
  isAdmin,
  validateProductId,
  deleteProduct
);

export default router;
