import Joi from 'joi';

export const createSessionSchema = Joi.object({
    classId: Joi.number().integer().required().messages({
        'number.base': 'Class ID phải là số',
        'any.required': 'Class ID là bắt buộc'
    }),
    duration: Joi.number().integer().min(1).max(480).messages({ // Tối đa 8 tiếng
        'number.base': 'Thời lượng phải là số',
        'number.min': 'Thời lượng tối thiểu là 1 phút',
        'number.max': 'Thời lượng tối đa là 480 phút (8 tiếng)'
    })
}); 