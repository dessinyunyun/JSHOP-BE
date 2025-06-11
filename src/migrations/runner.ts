import { up } from './20240101000000-create-tables';
import sequelize from '../config/database';

async function runMigrations() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    await up(sequelize.getQueryInterface());
    console.log('Migrations completed successfully.');

    process.exit(0);
  } catch (error) {
    console.error('Error running migrations:', error);
    process.exit(1);
  }
}

runMigrations(); 