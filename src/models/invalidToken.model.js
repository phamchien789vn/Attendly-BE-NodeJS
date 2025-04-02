import { DataTypes } from 'sequelize';
import sequelize from '../configs/mysql.config.js';

const InvalidToken = sequelize.define('InvalidToken', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    token: {
        type: DataTypes.STRING(500),
        allowNull: false,
        unique: true
    },
    expiredAt: {
        type: DataTypes.DATE,
        allowNull: false
    }
});

export default InvalidToken; 