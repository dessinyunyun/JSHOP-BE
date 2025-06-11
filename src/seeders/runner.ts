import { up } from './20240101000000-admin-user';
import sequelize from '../config/database';

async function runSeeders() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    await up(sequelize.getQueryInterface());
    console.log('Seeders completed successfully.');

    process.exit(0);
  } catch (error) {
    console.error('Error running seeders:', error);
    process.exit(1);
  }
}

runSeeders(); 