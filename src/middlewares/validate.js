import Joi from 'joi';
import { StatusCodes } from 'http-status-codes'

// Middleware chung để kiểm tra dữ liệu theo schema Joi
const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            isSuccess: false,
            message: 'Validation error',
            data: error.details.map((err) => err.message),
        });
    }

    next();
};

export default validate;
