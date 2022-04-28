"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
/* 유저 테이블 생성을 위한 모델 정의 */
// @ts-ignore
class User extends sequelize_1.Model {
    // @ts-ignore
    static init(sequelize) {
        // @ts-ignore
        return super.init({
            user_id: {
                primaryKey: true,
                type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                allowNull: false,
            },
            email: {
                type: sequelize_1.DataTypes.STRING(30),
                allowNull: false,
                unique: true,
            },
            nickname: {
                type: sequelize_1.DataTypes.STRING(30),
                allowNull: false,
                unique: true,
            },
            password: {
                type: sequelize_1.DataTypes.STRING(200),
                allowNull: false,
            },
            role: {
                type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
                defaultValue: 0,
            },
        }, {
            sequelize,
            modelName: "User",
            tableName: "users",
            timestamps: false,
            paranoid: false,
            underscored: true,
            charset: "utf8",
            collate: "utf8_general_ci",
        });
    }
    // @ts-ignore
    static associate(db) {
        db.User.hasMany(db.Post, {
            foreignKey: "user_id",
            sourceKey: "user_id",
        });
        db.User.hasMany(db.Comment, {
            foreignKey: "user_id",
            sourceKey: "user_id",
        });
        db.User.hasMany(db.Like, {
            foreignKey: "user_id",
            sourceKey: "user_id",
        });
    }
}
exports.default = User;
