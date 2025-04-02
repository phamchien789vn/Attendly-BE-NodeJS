import cron from 'node-cron';
import Session from '../models/session.model.js';
import { Op } from 'sequelize';

// Chạy mỗi phút để kiểm tra và cập nhật trạng thái các buổi học
export const initSessionCron = () => {
    cron.schedule('* * * * *', async () => {
        try {
            await Session.update(
                { isActive: false },
                {
                    where: {
                        endTime: { [Op.lt]: new Date() },
                        isActive: true
                    }
                }
            );
        } catch (error) {
            console.error('Error updating expired sessions:', error);
        }
    });
}; 