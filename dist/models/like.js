"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
/* 좋아요 테이블 생성을 위한 모델 정의 */
// @ts-ignore
class Like extends sequelize_1.Model {
    // @ts-ignore
    static init(sequelize) {
        // @ts-ignore
        return super.init({}, {
            sequelize,
            modelName: "Like",
            tableName: "likes",
            timestamps: false,
            paranoid: false,
            underscored: true,
            charset: "utf8",
            collate: "utf8_general_ci",
        });
    }
    // @ts-ignore
    static associate(db) {
        db.Like.belongsTo(db.User, {
            foreignKey: "user_id",
            targetKey: "user_id",
        });
        db.Like.belongsTo(db.Post, {
            foreignKey: "post_id",
            targetKey: "post_id",
            onDelete: "cascade",
        });
    }
}
exports.default = Like;
