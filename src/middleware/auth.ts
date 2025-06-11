import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import {
  UnauthorizedError,
  ForbiddenError,
  ValidationError,
} from '../utils/errors';
import { JWT_CONFIG } from '../config/auth';
import logger from '../config/logger';

interface JwtPayload {
  id: string;
  role: string;
  iat: number;
  exp: number;
}

interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
    email: string;
    username: string;
  };
}

export const isAuthenticated = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedError('Authorization header is required');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedError('Bearer token is required');
    }

    if (!JWT_CONFIG.secret) {
      logger.error('JWT secret is not configured');
      throw new Error('Server configuration error');
    }

    const decoded = jwt.verify(token, JWT_CONFIG.secret) as JwtPayload;

    // Check if token is expired
    if (decoded.exp && Date.now() >= decoded.exp * 1000) {
      throw new UnauthorizedError('Token has expired');
    }

    // Get user from database
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['password'] }, // Don't include password
    });

    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    // Attach user to request
    req.user = {
      id: user.id,
      role: user.role,
      email: user.email,
      username: user.username,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      next(new UnauthorizedError('Token has expired'));
    } else if (error instanceof jwt.JsonWebTokenError) {
      next(new UnauthorizedError('Invalid token'));
    } else {
      next(error);
    }
  }
};

export const isAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    throw new UnauthorizedError('Authentication required');
  }

  if (req.user.role !== 'admin') {
    throw new ForbiddenError('Admin access required');
  }

  next();
};
