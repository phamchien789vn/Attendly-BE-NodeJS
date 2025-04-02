import Class from '../models/class.model.js';
import User from '../models/user.model.js'
import QRCode from 'qrcode';
import { StatusCodes } from 'http-status-codes'
import Session from '../models/session.model.js';
import Attendance from '../models/attendance.model.js';

export const createClass = async (req, res) => {
    try {
        const { name } = req.body;
        const teacherId = req.user.id; // Lấy teacherId từ user đã đăng nhập

        const newClass = await Class.create({
            name,
            teacherId
        });

        // Tạo mã QR
        const qrCode = await QRCode.toDataURL(`attendly://class/${newClass.id}`);
        newClass.qrCode = qrCode;
        await newClass.save();

        res.status(StatusCodes.CREATED).json({
            isSuccess: true,
            message: 'Tạo lớp học thành công',
            data: newClass
        });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            isSuccess: false,
            message: error.message
        });
    }
};

export const getStudentsInClass = async (req, res) => {
    try {
        const { classId } = req.params;

        const classData = await Class.findOne({
            where: { id: classId },
            include: [
                {
                    model: User,
                    as: 'Students',
                    attributes: ['id', 'name', 'email'],
                    through: { attributes: [] }
                }
            ]
        });

        if (!classData) {
            return res.status(StatusCodes.NOT_FOUND).json({
                isSuccess: false,
                message: 'Không tìm thấy lớp học'
            });
        }

        res.status(StatusCodes.OK).json({
            isSuccess: true,
            message: 'Lấy danh sách học sinh trong lớp thành công',
            data: {
                className: classData.name,
                students: classData.Students,
                totalStudents: classData.Students.length
            }
        });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            isSuccess: false,
            message: error.message
        });
    }
};

export const getTeacherClasses = async (req, res) => {
    try {
        const teacherId = req.user.id;

        const classes = await Class.findAll({
            where: { teacherId },
            attributes: ['id', 'name', 'qrCode'],
            include: [
                {
                    model: User,
                    as: 'Students',  // Sử dụng alias đã định nghĩa
                    attributes: ['id', 'name', 'email'],
                    through: { attributes: [] }
                }
            ]
        });

        return res.status(StatusCodes.OK).json({
            isSuccess: true,
            message: 'Lấy danh sách lớp học thành công',
            data: {
                classes,
                totalClasses: classes.length,
                classesInfo: classes.map(c => ({
                    id: c.id,
                    name: c.name,
                    totalStudents: c.Students?.length || 0
                }))
            }
        });
    } catch (error) {
        console.error('Error in getTeacherClasses:', error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            isSuccess: false,
            message: error.message
        });
    }
};

export const getClassSessions = async (req, res) => {
    try {
        const { classId } = req.params;

        // Kiểm tra lớp học có tồn tại không
        const classData = await Class.findByPk(classId);
        if (!classData) {
            return res.status(StatusCodes.NOT_FOUND).json({
                isSuccess: false,
                message: 'Không tìm thấy lớp học'
            });
        }

        // Lấy danh sách các buổi học
        const sessions = await Session.findAll({
            where: { classId },
            attributes: [
                'id',
                'qrCode',
                'startTime',
                'endTime',
                'isActive',
                'createdAt'
            ],
            include: [
                {
                    model: Attendance,
                    attributes: ['id', 'studentId', 'attendedAt'],
                    include: [
                        {
                            model: User,
                            attributes: ['id', 'name', 'email'],
                        }
                    ]
                }
            ],
            order: [['startTime', 'DESC']] // Sắp xếp theo thời gian bắt đầu mới nhất
        });

        // Xử lý và format dữ liệu trả về
        const formattedSessions = sessions.map(session => {
            const now = new Date();
            const endTime = new Date(session.endTime);
            const startTime = new Date(session.startTime);

            // Tính trạng thái buổi học
            let status;
            if (now < startTime) {
                status = 'UPCOMING'; // Sắp diễn ra
            } else if (now > endTime) {
                status = 'ENDED'; // Đã kết thúc
            } else {
                status = 'IN_PROGRESS'; // Đang diễn ra
            }

            // Tính thời gian còn lại (nếu đang diễn ra)
            let remainingTime = null;
            if (status === 'IN_PROGRESS') {
                const remainingMinutes = Math.round((endTime - now) / 60000);
                remainingTime = `${remainingMinutes} phút`;
            }

            // Tính thời lượng buổi học
            const durationMinutes = Math.round((endTime - startTime) / 60000);

            return {
                id: session.id,
                startTime: session.startTime,
                endTime: session.endTime,
                duration: `${durationMinutes} phút`,
                status,
                remainingTime,
                isActive: session.isActive,
                qrCode: session.qrCode,
                createdAt: session.createdAt,
                attendance: {
                    total: session.Attendances.length,
                    details: session.Attendances.map(att => ({
                        studentId: att.studentId,
                        studentName: att.User.name,
                        studentEmail: att.User.email,
                        attendedAt: att.attendedAt
                    }))
                }
            };
        });

        // Thống kê tổng quan
        const statistics = {
            totalSessions: sessions.length,
            activeSessions: sessions.filter(s => s.isActive).length,
            upcomingSessions: formattedSessions.filter(s => s.status === 'UPCOMING').length,
            inProgressSessions: formattedSessions.filter(s => s.status === 'IN_PROGRESS').length,
            endedSessions: formattedSessions.filter(s => s.status === 'ENDED').length
        };

        return res.status(StatusCodes.OK).json({
            isSuccess: true,
            message: 'Lấy danh sách buổi học thành công',
            data: {
                className: classData.name,
                statistics,
                sessions: formattedSessions
            }
        });
    } catch (error) {
        console.error('Error in getClassSessions:', error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            isSuccess: false,
            message: error.message
        });
    }
};
