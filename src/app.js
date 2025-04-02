import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import sequelize from './configs/mysql.config.js';
import routes from './routes/index.js';
import './models/associations.model.js';
import { initSessionCron } from './utils/sessionCron.js';
import { initTokenCleanup } from './utils/tokenCleanup.js';

dotenv.config();

const app = express();

app.set('trust proxy', 1);

app.use(cors());
app.use(bodyParser.json());

app.use('/', routes)

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
    console.log(`🚀 Server running on port ${PORT}`);

    // Kiểm tra kết nối MySQL mỗi khi server khởi động
    try {
        await sequelize.authenticate();
        console.log('✅ Database connected successfully.');

        // Tạo bảng nếu chưa có
        await sequelize.sync({ alter: true }); // Sử dụng `alter: true` để cập nhật bảng nếu có thay đổi
        console.log('✅ All tables are synchronized.');

        // Khởi chạy các cronjob
        initSessionCron();
        console.log('✅ Session cleanup cron job started.');

        initTokenCleanup();
        console.log('✅ Token cleanup cron job started.');

    } catch (error) {
        console.error('❌ Database connection error:', error);
    }
});
