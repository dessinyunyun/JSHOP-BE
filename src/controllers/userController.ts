import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { UserService } from '../services/userService';
import { ValidationError, UnauthorizedError } from '../utils/errors';
import { successResponse } from '../utils/response';
import { JWT_CONFIG } from '../config/auth';
import logger from '../config/logger';

interface AuthRequest extends Request {
  user?: {
    id: number;
    role: string;
  };
}

const userService = new UserService();

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, email, password } = req.body;
    logger.info('Registering user:', { email, username });
    const user = await userService.createUser({ username, email, password });
    return successResponse(res, user, 'User registered successfully', 201);
  } catch (error) {
    logger.error('Registration error:', error);
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    logger.info('Login attempt:', { email });

    // First, check if password was provided
    if (!password) {
      throw new ValidationError('Password is required');
    }

    // Get user WITH password field included
    const user = await userService.findByEmailWithPassword(email);
    logger.info('User found:', {
      found: !!user,
      userId: user?.id,
      userEmail: user?.email,
      userRole: user?.role,
    });

    if (!user) {
      logger.warn('Login failed: User not found');
      throw new UnauthorizedError('Invalid credentials');
    }

    // Verify password exists in user object
    if (!user.password) {
      logger.warn('Login failed: User password not set');
      throw new UnauthorizedError('Invalid credentials');
    }

    // Compare passwords
    const isValidPassword = await bcrypt.compare(password, user.password);
    logger.info('Password validation:', {
      isValid: isValidPassword,
    });

    if (!isValidPassword) {
      logger.warn('Login failed: Invalid password');
      throw new UnauthorizedError('Invalid credentials');
    }

    // Create token
    if (!JWT_CONFIG.secret) {
      logger.error('JWT secret is not configured');
      throw new Error('JWT secret is not configured');
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      JWT_CONFIG.secret,
      { expiresIn: JWT_CONFIG.expiresIn }
    );

    // Remove password before sending response
    const userWithoutPassword = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    logger.info('Login successful:', { userId: user.id });
    return successResponse(
      res,
      { token, user: userWithoutPassword },
      'Login successful'
    );
  } catch (error) {
    logger.error('Login error:', error);
    next(error);
  }
};

export const verifyToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('Invalid token');
    }

    // Get fresh user data from database
    const user = await userService.findById(req.user.id);
    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    // Remove sensitive data before sending response
    const userResponse = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    return successResponse(res, {
      isValid: true,
      user: userResponse,
    });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user?.id) {
      throw new ValidationError('User not found');
    }
    const user = await userService.findById(req.user.id);
    if (!user) {
      throw new ValidationError('User not found');
    }
    return successResponse(res, user);
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, email } = req.body;
    if (!req.user?.id) {
      throw new ValidationError('User not found');
    }
    const user = await userService.updateUser(req.user.id, { username, email });
    if (!user) {
      throw new ValidationError('User not found');
    }
    return successResponse(res, user, 'Profile updated successfully');
  } catch (error) {
    next(error);
  }
};
