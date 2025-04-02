import Session from '../models/session.model.js';
import { generateQRCode } from '../utils/qrGenerator.js';
import { StatusCodes } from 'http-status-codes';
import { addMinutes } from 'date-fns'; // Thêm thư viện để xử lý thời gian

export const createSession = async (req, res) => {
    try {
        const { classId } = req.params; // duration tính bằng phút, mặc định 45 phút

        const duration = 45

        // Tạo thời gian bắt đầu và kết thúc
        const startTime = new Date();
        const endTime = addMinutes(startTime, duration);

        // Tạo URL mã QR cho buổi học
        const sessionData = `attendance/class:${classId}/session:${Date.now()}`;
        const qrCodeURL = await generateQRCode(sessionData);

        // Lưu vào DB
        const session = await Session.create({
            classId,
            qrCode: qrCodeURL,
            startTime,
            endTime,
            isActive: true
        });

        res.status(StatusCodes.CREATED).json({
            isSuccess: true,
            message: 'Tạo buổi học thành công',
            data: {
                id: session.id,
                classId: session.classId,
                qrCode: session.qrCode,
                startTime: session.startTime,
                endTime: session.endTime,
                duration: `${duration} phút`
            }
        });
    } catch (error) {
        console.error('Error in createSession:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            isSuccess: false,
            message: error.message
        });
    }
};
