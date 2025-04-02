import Joi from 'joi';

export const createClassSchema = Joi.object({
    name: Joi.string().required().min(3).max(100).messages({
        'string.empty': 'Tên lớp không được để trống',
        'string.min': 'Tên lớp phải có ít nhất 3 ký tự',
        'string.max': 'Tên lớp không được vượt quá 100 ký tự',
        'any.required': 'Tên lớp là bắt buộc'
    })
});
