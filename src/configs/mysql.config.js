import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    timezone: '+07:00', // Cấu hình múi giờ GMT+7
    logging: false,
    define: {
        timestamps: true, // Tự động thêm createdAt và updatedAt
        underscored: true, // Sử dụng snake_case cho tên cột
        timezone: '+07:00', // Đảm bảo timestamps cũng được lưu ở GMT+7
    },
    dialectOptions: {
        timezone: '+07:00', // Cấu hình múi giờ cho MySQL connection
    },
});

try {
    await sequelize.authenticate();
    console.log('✅ MySQL connected...');
} catch (error) {
    console.error('❌ MySQL connection failed:', error);
}

export default sequelize;
