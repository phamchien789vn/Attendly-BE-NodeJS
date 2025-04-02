import User from '../models/user.model.js';
import { StatusCodes } from 'http-status-codes'

// Lấy danh sách users
export const getUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(StatusCodes.OK).json({
            isSuccess: true,
            message: "Lấy danh sách người dùng thành công",
            data: users
        });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            isSuccess: false,
            message: error.message
        });
    }
};

// Tạo user mới
export const createUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const newUser = await User.create({ name, email, password });
        res.status(201).json(newUser);
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            isSuccess: false,
            message: error.message
        });
    }
};
