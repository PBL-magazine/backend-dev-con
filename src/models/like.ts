import { Model } from "sequelize";

/* 좋아요 테이블 생성을 위한 모델 정의 */
// @ts-ignore
class Like extends Model {
  // @ts-ignore
  static init(sequelize) {
    // @ts-ignore
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

export default Like;
