import { DataTypes, Model } from "sequelize";

/* 포스트 테이블 생성을 위한 모델 정의 */
// @ts-ignore
class Post extends Model {
  // @ts-ignore
  static init(sequelize) {
    // @ts-ignore
    return super.init(
      {
        post_id: {
          primaryKey: true,
          type: DataTypes.INTEGER.UNSIGNED,
          autoIncrement: true,
          allowNull: false,
        },
        content: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        image: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: "Post",
        tableName: "posts",
        timestamps: true, // createdAt, updatedAt 자동생성
        paranoid: true, // deletedAt 자동생성
        underscored: true, // 테이블명, 컬럼명 스네이크 케이스 적용 여부 (false: 케멀케이스)
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
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

export default Post;
