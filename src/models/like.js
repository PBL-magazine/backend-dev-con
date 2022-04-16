const { Model } = require("sequelize");

class Like extends Model {
  static init(sequelize) {
    return super.init(
      {},
      {
        sequelize,
        modelName: "Like",
        tableName: "likes",
        timestamps: false, // createdAt, updatedAt 자동생성
        paranoid: false, // deletedAt 자동생성
        underscored: true, // 테이블명, 컬럼명 스네이크 케이스 적용 여부 (false: 케멀케이스)
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }

  static associate(db) {
    db.Like.belongsTo(db.User, {
      foreignKey: "user_id",
      targetKey: "user_id",
    });
    db.Like.belongsTo(db.Post, {
      foreignKey: "post_id",
      targetKey: "post_id",
    });
  }
}

module.exports = Like;
