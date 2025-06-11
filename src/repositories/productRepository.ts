import Product from '../models/Product';
import logger from '../config/logger';
import { FindOptions } from 'sequelize';

export class ProductRepository {
  async create(data: any) {
    try {
      return await Product.create(data);
    } catch (error) {
      logger.error('Repository error in create product:', error);
      throw error;
    }
  }

  async findAll(options: FindOptions = {}) {
    try {
      return await Product.findAll(options);
    } catch (error) {
      logger.error('Repository error in find all products:', error);
      throw error;
    }
  }

  async count() {
    try {
      return await Product.count();
    } catch (error) {
      logger.error('Repository error in count products:', error);
      throw error;
    }
  }

  async findById(id: string) {
    try {
      return await Product.findByPk(id);
    } catch (error) {
      logger.error(`Repository error in find product by id ${id}:`, error);
      throw error;
    }
  }

  async update(id: string, data: any) {
    try {
      const product = await Product.findByPk(id);
      if (!product) return null;
      return await product.update(data);
    } catch (error) {
      logger.error(`Repository error in update product ${id}:`, error);
      throw error;
    }
  }

  async delete(id: string) {
    try {
      const product = await Product.findByPk(id);
      if (!product) return false;
      await product.destroy();
      return true;
    } catch (error) {
      logger.error(`Repository error in delete product ${id}:`, error);
      throw error;
    }
  }
} 