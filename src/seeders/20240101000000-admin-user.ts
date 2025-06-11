import { QueryInterface } from 'sequelize';
import bcrypt from 'bcryptjs';
import { UserRole } from '../models/User';
export async function up(queryInterface: QueryInterface) {
  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10);
  
  await queryInterface.bulkInsert('Users', [{
    id: '1',
    username: 'admin',
    email: 'admin@example.com',
    password: hashedPassword,
    role: UserRole.ADMIN,
    createdAt: new Date(),
    updatedAt: new Date()
  }]);
}

export async function down(queryInterface: QueryInterface) {
  await queryInterface.bulkDelete('Users', { email: 'admin@example.com' });
} 