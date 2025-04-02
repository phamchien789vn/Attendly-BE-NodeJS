import Attendance from '../models/attendance.model.js';
import Session from '../models/session.model.js'
import User from '../models/user.model.js'
import { StatusCodes } from 'http-status-codes'
import Class from '../models/class.model.js'
import { Op } from 'sequelize'
import StudentClasses from '../models/studentClasses.model.js';

// API điểm danh
export const markAttendance = async (req, res) => {
    try {
        const { qrCode } = req.body;
        const studentId = req.user.id;

        // Parse qrCode để lấy classId và sessionId
        const matches = qrCode.match(/attendance\/class:(\d+)\/session:(\d+)/);
        if (!matches) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                isSuccess: false,
                message: 'QR code không hợp lệ'
            });
        }

        const classId = parseInt(matches[1]);
        const sessionTime = parseInt(matches[2]);

        // Kiểm tra xem học sinh đã trong lớp chưa
        const studentClass = await StudentClasses.findOne({
            where: {
                studentId,
                classId
            }
        });

        // Nếu học sinh chưa trong lớp, tự động thêm vào
        if (!studentClass) {
            await StudentClasses.create({
                studentId,
                classId
            });
        }

        // Tìm session dựa vào classId và thời gian tạo gần nhất với sessionTime
        const session = await Session.findOne({
            where: {
                classId,
                isActive: true,
                endTime: {
                    [Op.gt]: new Date() // endTime phải lớn hơn thời điểm hiện tại
                }
            },
            order: [
                ['createdAt', 'DESC']
            ]
        });

        if (!session) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                isSuccess: false,
                message: 'Buổi học không tồn tại hoặc đã hết hạn điểm danh'
            });
        }

        // Kiểm tra xem học sinh đã điểm danh buổi này chưa
        const alreadyMarked = await Attendance.findOne({
            where: { studentId, sessionId: session.id }
        });

        if (alreadyMarked) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                isSuccess: false,
                message: 'Đã điểm danh rồi'
            });
        }

        // Thêm bản ghi điểm danh
        const attendance = await Attendance.create({
            studentId,
            sessionId: session.id,
            attendedAt: new Date()
        });

        return res.status(StatusCodes.CREATED).json({
            isSuccess: true,
            message: studentClass ? 'Điểm danh thành công' : 'Đã thêm vào lớp và điểm danh thành công',
            data: {
                id: attendance.id,
                sessionId: attendance.sessionId,
                attendedAt: attendance.attendedAt,
                remainingTime: `${Math.round((new Date(session.endTime) - new Date()) / 60000)} phút`,
                wasAddedToClass: !studentClass // thêm trường này để frontend biết học sinh vừa được thêm vào lớp
            }
        });
    } catch (error) {
        console.error('Error in markAttendance:', error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            isSuccess: false,
            message: error.message
        });
    }
};

// API để giáo viên xem danh sách học sinh đã điểm danh
export const getAttendanceList = async (req, res) => {
    try {
        const { classId, sessionId } = req.params;

        // Kiểm tra session có tồn tại và thuộc về lớp này không
        const session = await Session.findOne({
            where: {
                id: sessionId,
                classId: classId
            }
        });

        if (!session) {
            return res.status(StatusCodes.NOT_FOUND).json({
                isSuccess: false,
                message: 'Không tìm thấy buổi học này hoặc buổi học không thuộc về lớp này'
            });
        }

        // Lấy danh sách tất cả học sinh trong lớp
        const classData = await Class.findOne({
            where: { id: classId },
            include: [
                {
                    model: User,
                    as: 'Students', // Sử dụng alias đã định nghĩa cho học sinh
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

        // Lấy danh sách học sinh đã điểm danh trong buổi học này
        const attendances = await Attendance.findAll({
            where: { sessionId },
            attributes: ['id', 'studentId', 'attendedAt'],
            include: [
                {
                    model: User,
                    attributes: ['id', 'name', 'email']
                }
            ]
        });

        // Tạo map các học sinh đã điểm danh để dễ kiểm tra
        const attendedStudentIds = new Set(attendances.map(a => a.studentId));

        // Phân loại học sinh đã điểm danh và chưa điểm danh
        const attendedStudents = [];
        const notAttendedStudents = [];

        classData.Students.forEach(student => {
            if (attendedStudentIds.has(student.id)) {
                const attendance = attendances.find(a => a.studentId === student.id);
                attendedStudents.push({
                    id: student.id,
                    name: student.name,
                    email: student.email,
                    attendedAt: attendance.attendedAt
                });
            } else {
                notAttendedStudents.push({
                    id: student.id,
                    name: student.name,
                    email: student.email
                });
            }
        });

        return res.status(StatusCodes.OK).json({
            isSuccess: true,
            message: 'Lấy danh sách điểm danh thành công',
            data: {
                className: classData.name,
                sessionInfo: {
                    id: session.id,
                    date: session.date
                },
                attendance: {
                    total: classData.Students.length,
                    attended: attendedStudents.length,
                    notAttended: notAttendedStudents.length,
                    attendanceRate: `${((attendedStudents.length / classData.Students.length) * 100).toFixed(1)}%`
                },
                attendedStudents,
                notAttendedStudents
            }
        });
    } catch (error) {
        console.error('Error in getAttendanceList:', error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            isSuccess: false,
            message: error.message
        });
    }
};