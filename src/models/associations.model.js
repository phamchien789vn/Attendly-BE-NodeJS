import User from './user.model.js';
import Class from './class.model.js';
import StudentClasses from './studentClasses.model.js';

// Quan hệ giáo viên - lớp học (1 giáo viên có nhiều lớp)
User.hasMany(Class, {
    foreignKey: 'teacherId',
    as: 'TeachingClasses'  // Đặt alias cho quan hệ giáo viên
});
Class.belongsTo(User, {
    foreignKey: 'teacherId',
    as: 'Teacher'  // Đặt alias cho quan hệ giáo viên
});

// Quan hệ học sinh - lớp học (nhiều-nhiều)
User.belongsToMany(Class, {
    through: StudentClasses,
    foreignKey: 'studentId',
    as: 'EnrolledClasses'  // Đặt alias cho lớp học mà học sinh tham gia
});
Class.belongsToMany(User, {
    through: StudentClasses,
    foreignKey: 'classId',
    as: 'Students'  // Đặt alias cho học sinh trong lớp
});

// Thêm vào file associations.model.js
import Attendance from './attendance.model.js';
import Session from './session.model.js';

// Thiết lập quan hệ cho Attendance
User.hasMany(Attendance, { foreignKey: 'studentId' });
Attendance.belongsTo(User, { foreignKey: 'studentId' });

Session.hasMany(Attendance, { foreignKey: 'sessionId' });
Attendance.belongsTo(Session, { foreignKey: 'sessionId' });