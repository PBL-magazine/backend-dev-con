const { Model } = require("sequelize");

/* 좋아요 테이블 생성을 위한 모델 정의 */
class Like extends Model {
  static init(sequelize) {
    return super.init(
      {},
      {
        sequelize,
        modelName: "Like",
        tableName: "likes",
        timestamps: false,
        paranoid: false,
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
      onDelete: "cascade",
    });
  }
}

module.exports = Like;
