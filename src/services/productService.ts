import Product from '../models/Product';
import { ProductRepository } from '../repositories/productRepository';
import logger from '../config/logger';
import { PaginationParams, PaginatedResponse } from '../utils/pagination';

interface ProductResponse {
  id?: string;
  name: string;
  description: string;
  image: string;
  imageUrl: string;
  price: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class ProductService {
  private productRepository: ProductRepository;

  constructor() {
    this.productRepository = new ProductRepository();
  }

  async getAllProducts(params: PaginationParams): Promise<PaginatedResponse<Product>> {
    const page = params.page || 1;
    const limit = params.limit || 10;
    const offset = (page - 1) * limit;

    const [products, total] = await Promise.all([
      this.productRepository.findAll({ limit, offset }),
      this.productRepository.count()
    ]);

    

    const totalPages = Math.ceil(total / limit);

    return {
      data: products,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrevious: page > 1
      }
    };
  }

  async getProductById(id: string): Promise<ProductResponse | null> {
    try {
      const product = await this.productRepository.findById(id);
      if (product) {
        return {
          ...product.toJSON(),
          imageUrl: product.imageUrl
        };
      }
      return null;
    } catch (error) {
      logger.error(`Error in getProductById service for id ${id}:`, error);
      throw error;
    }
  }

  async createProduct(productData: Partial<Product>): Promise<ProductResponse> {
    try {
      const product = await this.productRepository.create(productData);
      return {
        ...product.toJSON(),
        imageUrl: product.imageUrl
      };
    } catch (error) {
      logger.error('Error in createProduct service:', error);
      throw error;
    }
  }

  async updateProduct(id: string, productData: Partial<Product>): Promise<ProductResponse | null> {
    try {
      const product = await this.productRepository.update(id, productData);
      if (product) {
        return {
          ...product.toJSON(),
          imageUrl: product.imageUrl
        };
      }
      return null;
    } catch (error) {
      logger.error(`Error in updateProduct service for id ${id}:`, error);
      throw error;
    }
  }

  async deleteProduct(id: string): Promise<boolean> {
    try {
      return await this.productRepository.delete(id);
    } catch (error) {
      logger.error(`Error in deleteProduct service for id ${id}:`, error);
      throw error;
    }
  }
} 