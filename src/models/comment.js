const { DataTypes, Model } = require("sequelize");

class Comment extends Model {
  static init(sequelize) {
    return super.init(
      {
        comment_id: {
          primaryKey: true,
          type: DataTypes.INTEGER.UNSIGNED,
          autoIncrement: true,
          allowNull: false,
        },
        content: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: "Comment",
        tableName: "comments",
        timestamps: true, // createdAt, updatedAt 자동생성
        paranoid: true, // deletedAt 자동생성
        underscored: true, // 테이블명, 컬럼명 스네이크 케이스 적용 여부 (false: 케멀케이스)
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }

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

module.exports = Comment;