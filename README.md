# Attendly Backend

Attendly là một hệ thống quản lý điểm danh thông minh sử dụng QR Code, được xây dựng bằng Node.js và Express.js.

## Tính năng chính

- Xác thực người dùng (Authentication) với JWT
- Quản lý lớp học (Class Management)
- Quản lý điểm danh (Attendance Management)
- Tạo và quét mã QR Code cho điểm danh
- Báo cáo và thống kê điểm danh
- Tự động cập nhật trạng thái điểm danh

## Công nghệ sử dụng

- Node.js
- Express.js
- MySQL (với Sequelize ORM)
- JWT cho xác thực
- QR Code cho điểm danh
- Joi cho validation
- Node-cron cho các tác vụ tự động

## Cấu trúc dự án

```
src/
├── app.js              # Entry point của ứng dụng
├── configs/            # Cấu hình database và các thiết lập khác
├── controllers/        # Xử lý logic nghiệp vụ
├── middlewares/        # Middleware functions
├── models/            # Database models
├── routes/            # Định tuyến API
├── utils/             # Các hàm tiện ích
└── validations/       # Schema validation
```

## Yêu cầu hệ thống

- Node.js (v14 trở lên)
- MySQL
- npm hoặc yarn

## Cài đặt

1. Clone repository:
```bash
git clone [repository-url]
cd attendly-be
```

2. Cài đặt dependencies:
```bash
npm install
```

3. Tạo file .env và cấu hình các biến môi trường:
```env
PORT=3000
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=attendly_db
JWT_SECRET=your_jwt_secret
```

4. Chạy ứng dụng:
- Môi trường development:
```bash
npm run dev
```
- Môi trường production:
```bash
npm start
```
