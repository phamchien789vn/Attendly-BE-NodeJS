import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import User from '../models/user.model.js';
import Class from '../models/class.model.js';
import StudentClasses from '../models/studentClasses.model.js';
import InvalidToken from '../models/invalidToken.model.js';


// Middleware xác thực JWT
export const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                isSuccess: false,
                message: 'Không tìm thấy token xác thực'
            });
        }

        // Kiểm tra token có trong danh sách token đã đăng xuất không
        const invalidToken = await InvalidToken.findOne({
            where: { token }
        });

        if (invalidToken) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                isSuccess: false,
                message: 'Token không hợp lệ hoặc đã đăng xuất'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByPk(decoded.id);

        if (!user) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                isSuccess: false,
                message: 'Người dùng không tồn tại'
            });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            isSuccess: false,
            message: 'Token không hợp lệ hoặc đã hết hạn'
        });
    }
};

// Middleware kiểm tra role
export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(StatusCodes.FORBIDDEN).json({
                isSuccess: false,
                message: 'Bạn không có quyền truy cập chức năng này'
            });
        }
        next();
    };
};

// Middleware kiểm tra quyền với lớp học
export const authorizeClass = async (req, res, next) => {
    try {
        const { classId } = req.params;
        const userId = req.user.id;
        const userRole = req.user.role;

        // Nếu là giáo viên, kiểm tra xem có phải giáo viên của lớp không
        if (userRole === 'teacher') {
            const isTeacher = await Class.findOne({
                where: {
                    id: classId,
                    teacherId: userId
                }
            });

            if (!isTeacher) {
                return res.status(StatusCodes.FORBIDDEN).json({
                    isSuccess: false,
                    message: 'Bạn không phải là giáo viên của lớp này'
                });
            }
        }
        // Nếu là học sinh, kiểm tra xem có trong lớp không
        else if (userRole === 'student') {
            const isStudent = await StudentClasses.findOne({
                where: {
                    classId,
                    studentId: userId
                }
            });

            if (!isStudent) {
                return res.status(StatusCodes.FORBIDDEN).json({
                    isSuccess: false,
                    message: 'Bạn không phải là học sinh của lớp này'
                });
            }
        }

        next();
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            isSuccess: false,
            message: error.message
        });
    }
}; 