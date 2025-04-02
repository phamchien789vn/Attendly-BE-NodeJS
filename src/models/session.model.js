import { DataTypes } from 'sequelize';
import sequelize from '../configs/mysql.config.js';
import Class from './class.model.js';

const Session = sequelize.define('Session', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    classId: { type: DataTypes.INTEGER, allowNull: false },
    qrCode: { type: DataTypes.TEXT, allowNull: false }, // Lưu URL QR
    startTime: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    endTime: {
        type: DataTypes.DATE,
        allowNull: false
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
});

Class.hasMany(Session, { foreignKey: 'classId' });
Session.belongsTo(Class, { foreignKey: 'classId' });

export default Session;
