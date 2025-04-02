import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false,
});

try {
    await sequelize.authenticate();
    console.log('✅ MySQL connected...');
} catch (error) {
    console.error('❌ MySQL connection failed:', error);
}

export default sequelize;
