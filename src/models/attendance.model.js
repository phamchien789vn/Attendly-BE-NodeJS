import { DataTypes } from 'sequelize';
import sequelize from '../configs/mysql.config.js';
import Student from './user.model.js'
import Session from './session.model.js'

const Attendance = sequelize.define('Attendance', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    studentId: { type: DataTypes.INTEGER, allowNull: false },
    sessionId: { type: DataTypes.INTEGER, allowNull: false },
    attendedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
});

// Tạo liên kết giữa Attendance, Student và Session
Student.hasMany(Attendance, { foreignKey: 'studentId' });
Attendance.belongsTo(Student, { foreignKey: 'studentId' });

Session.hasMany(Attendance, { foreignKey: 'sessionId' });
Attendance.belongsTo(Session, { foreignKey: 'sessionId' });

export default Attendance;
