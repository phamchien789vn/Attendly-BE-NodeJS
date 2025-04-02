import Joi from 'joi';

export const attendanceSchema = Joi.object({
    qrCode: Joi.string().required().pattern(/^attendance\/class:\d+\/session:\d+$/).messages({
        'string.pattern.base': 'QR code không đúng định dạng',
        'any.required': 'QR code là bắt buộc'
    })
});
