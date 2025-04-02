import { DataTypes } from 'sequelize';
import sequelize from '../configs/mysql.config.js';
import User from './user.model.js';
import Class from './class.model.js';

const StudentClasses = sequelize.define('StudentClasses', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    studentId: { type: DataTypes.INTEGER, allowNull: false },
    classId: { type: DataTypes.INTEGER, allowNull: false }
});

export default StudentClasses;
