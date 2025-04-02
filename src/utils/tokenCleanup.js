import cron from 'node-cron';
import InvalidToken from '../models/invalidToken.model.js';
import { Op } from 'sequelize';

// Chạy mỗi ngày một lần để xóa các token đã hết hạn
export const initTokenCleanup = () => {
    cron.schedule('0 0 * * *', async () => {
        try {
            await InvalidToken.destroy({
                where: {
                    expiredAt: { [Op.lt]: new Date() }
                }
            });
        } catch (error) {
            console.error('Error cleaning up expired tokens:', error);
        }
    });
}; 