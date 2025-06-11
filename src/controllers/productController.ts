import { Request, Response, NextFunction } from 'express';
import { ProductService } from '../services/productService';
import { ValidationError, NotFoundError } from '../utils/errors';
import { successResponse } from '../utils/response';
import logger from '../config/logger';
import { PaginationParams } from '../utils/pagination';

const productService = new ProductService();

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description, price } = req.body;
    const image = req.file?.filename;

    if (!image) {
      throw new ValidationError('Product image is required');
    }

    const product = await productService.createProduct({
      name,
      description,
      price: parseFloat(price),
      image
    });

    return successResponse(res, product, 'Product created successfully', 201);
  } catch (error) {
    logger.error('Create product error:', error);
    next(error);
  }
};

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = '1', limit = '10' } = req.query;
    const paginationParams: PaginationParams = {
      page: parseInt(page as string),
      limit: parseInt(limit as string)
    };
    const { data, meta } = await productService.getAllProducts(paginationParams);
    return res.json({
      status: 'success',
      message: 'Success',
      data,
      meta
    });
  } catch (error) {
    logger.error('Get products error:', error);
    next(error);
  }
};

export const getProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    logger.info('Getting product with ID:', id);

    const product = await productService.getProductById(id);
    if (!product) {
      logger.warn('Product not found:', id);
      throw new NotFoundError('Product not found');
    }

    return successResponse(res, product);
  } catch (error) {
    logger.error('Get product error:', error);
    next(error);
  }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name, description, price } = req.body;
    const image = req.file?.filename;

    logger.info('Updating product:', { id, name, description, price, hasNewImage: !!image });

    const product = await productService.getProductById(id);
    if (!product) {
      logger.warn('Product not found for update:', id);
      throw new NotFoundError('Product not found');
    }

    const updatedProduct = await productService.updateProduct(id, {
      name,
      description,
      price: price ? parseFloat(price) : undefined,
      image
    });

    return successResponse(res, updatedProduct, 'Product updated successfully');
  } catch (error) {
    logger.error('Update product error:', error);
    next(error);
  }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    logger.info('Deleting product:', id);

    const product = await productService.getProductById(id);
    if (!product) {
      logger.warn('Product not found for deletion:', id);
      throw new NotFoundError('Product not found');
    }

    await productService.deleteProduct(id);
    return successResponse(res, null, 'Product deleted successfully');
  } catch (error) {
    logger.error('Delete product error:', error);
    next(error);
  }
}; 