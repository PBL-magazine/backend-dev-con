"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
/* 댓글 테이블 생성을 위한 모델 정의 */
// @ts-ignore
class Comment extends sequelize_1.Model {
    // @ts-ignore
    static init(sequelize) {
        // @ts-ignore
        return super.init({
            comment_id: {
                primaryKey: true,
                type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                allowNull: false,
            },
            content: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: false,
            },
        }, {
            sequelize,
            modelName: "Comment",
            tableName: "comments",
            timestamps: true,
            paranoid: true,
            underscored: true,
            charset: "utf8",
            collate: "utf8_general_ci",
        });
    }
    // @ts-ignore
    static associate(db) {
        db.Comment.belongsTo(db.User, {
            foreignKey: "user_id",
            targetKey: "user_id",
        });
        db.Comment.belongsTo(db.Post, {
            foreignKey: "post_id",
            targetKey: "post_id",
        });
    }
}
exports.default = Comment;
