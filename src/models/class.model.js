import { DataTypes } from 'sequelize';
import sequelize from '../configs/mysql.config.js';

const Class = sequelize.define('Class', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    teacherId: { type: DataTypes.INTEGER, allowNull: false },
    qrCode: { type: DataTypes.TEXT }
});

export default Class;
