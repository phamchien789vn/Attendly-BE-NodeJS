import QRCode from 'qrcode';

export const generateQRCode = async (data) => {
    try {
        return await QRCode.toDataURL(data); // Trả về URL ảnh QR
    } catch (error) {
        throw new Error('QR Code generation failed');
    }
};
