"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
/* 포스트 테이블 생성을 위한 모델 정의 */
// @ts-ignore
class Post extends sequelize_1.Model {
    // @ts-ignore
    static init(sequelize) {
        // @ts-ignore
        return super.init({
            post_id: {
                primaryKey: true,
                type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                allowNull: false,
            },
            content: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: false,
            },
            image: {
                type: sequelize_1.DataTypes.STRING(100),
                allowNull: false,
            },
        }, {
            sequelize,
            modelName: "Post",
            tableName: "posts",
            timestamps: true,
            paranoid: true,
            underscored: true,
            charset: "utf8",
            collate: "utf8_general_ci",
        });
    }
    // @ts-ignore
    static associate(db) {
        db.Post.belongsTo(db.User, {
            as: "author",
            foreignKey: "user_id",
            targetKey: "user_id",
        });
        db.Post.hasMany(db.Comment, {
            foreignKey: "post_id",
            sourceKey: "post_id",
        });
        db.Post.hasMany(db.Like, {
            foreignKey: "post_id",
            sourceKey: "post_id",
            onDelete: "cascade",
        });
    }
}
exports.default = Post;
