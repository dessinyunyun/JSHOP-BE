import bcrypt from 'bcryptjs';
import { Op } from 'sequelize';
import User, { UserRole } from '../models/User';
import { ValidationError } from '../utils/errors';
import logger from '../config/logger';

interface CreateUserData {
  username: string;
  email: string;
  password: string;
}

interface UpdateUserData {
  username?: string;
  email?: string;
}

export class UserService {
  async createUser(data: CreateUserData): Promise<User> {
    // Validate input
    if (!data.username || !data.email || !data.password) {
      throw new ValidationError('All fields are required');
    }

    // Check for existing user
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email: data.email }, { username: data.username }],
      },
    });

    if (existingUser) {
      throw new ValidationError(
        'User with this email or username already exists'
      );
    }

    console.log('Creating user with data:', data);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    // Create user
    const user = await User.create({
      username: data.username,
      email: data.email,
      password: hashedPassword,
      role: UserRole.USER,
    });

    logger.debug('User created', { userId: user.id });
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    if (!email) {
      throw new ValidationError('Email is required');
    }
    return User.findOne({
      where: { email },
      attributes: { exclude: ['password'] },
    });
  }

  async findById(id: number): Promise<User | null> {
    if (!id) {
      throw new ValidationError('User ID is required');
    }
    return User.findByPk(id, {
      attributes: { exclude: ['password'] },
    });
  }

  async updateUser(id: number, data: UpdateUserData): Promise<User | null> {
    if (!id) {
      throw new ValidationError('User ID is required');
    }

    const user = await User.findByPk(id);
    if (!user) {
      throw new ValidationError('User not found');
    }

    if (data.email || data.username) {
      const existingUser = await User.findOne({
        where: {
          [Op.or]: [
            data.email ? { email: data.email } : {},
            data.username ? { username: data.username } : {},
          ],
          id: { [Op.ne]: id },
        },
      });

      if (existingUser) {
        throw new ValidationError('Email or username already in use');
      }
    }

    return user.update(data);
  }

  async findByEmailWithPassword(email: string): Promise<User | null> {
    if (!email) {
      throw new ValidationError('Email is required');
    }
    return User.unscoped().findOne({
      // Use unscoped to ensure password is included
      where: { email },
    });
  }

  async verifyPassword(user: User, password: string): Promise<boolean> {
    if (!user.password) {
      logger.warn('No password set for user', { userId: user.id });
      return false;
    }
    return bcrypt.compare(password, user.password);
  }
}
