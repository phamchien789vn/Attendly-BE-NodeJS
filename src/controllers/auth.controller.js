import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes'
import InvalidToken from '../models/invalidToken.model.js';

export const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Kiểm tra email đã tồn tại chưa
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                isSuccess: false,
                message: 'Email đã được sử dụng'
            });
        }

        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);

        // Tạo user mới
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role
        });

        // Tạo JWT token
        const token = jwt.sign(
            {
                id: newUser.id,
                role: newUser.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '1d'
            }
        );

        // Loại bỏ password trước khi trả về
        const { password: _, ...userWithoutPassword } = newUser.toJSON();

        return res.status(StatusCodes.CREATED).json({
            isSuccess: true,
            message: 'Tạo tài khoản thành công',
            data: token
        });
    } catch (error) {
        console.error('Error in register:', error);
        return res.status(StatusCodes.BAD_REQUEST).json({
            isSuccess: false,
            message: error.message
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Tìm user theo email
        const user = await User.findOne({ where: { email } });

        // Kiểm tra user tồn tại và mật khẩu đúng
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                isSuccess: false,
                message: 'Email hoặc mật khẩu không đúng'
            });
        }

        // Tạo JWT token
        const token = jwt.sign(
            {
                id: user.id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '1d'
            }
        );

        // Loại bỏ password trước khi trả về
        const { password: _, ...userWithoutPassword } = user.toJSON();

        return res.status(StatusCodes.OK).json({
            isSuccess: true,
            message: 'Đăng nhập thành công',
            data: token
        });
    } catch (error) {
        console.error('Error in login:', error);
        return res.status(StatusCodes.BAD_REQUEST).json({
            isSuccess: false,
            message: error.message
        });
    }
};

export const logout = async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                isSuccess: false,
                message: 'Token không tồn tại'
            });
        }

        // Giải mã token để lấy thời gian hết hạn
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Lưu token vào danh sách token không hợp lệ
        await InvalidToken.create({
            token: token,
            expiredAt: new Date(decoded.exp * 1000) // Chuyển đổi từ timestamp sang Date
        });

        return res.status(StatusCodes.OK).json({
            isSuccess: true,
            message: 'Đăng xuất thành công'
        });
    } catch (error) {
        console.error('Error in logout:', error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            isSuccess: false,
            message: error.message
        });
    }
};
