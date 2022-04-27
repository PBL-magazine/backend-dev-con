import { DataTypes, Model } from "sequelize";

/* 유저 테이블 생성을 위한 모델 정의 */
// @ts-ignore
class User extends Model {
  // @ts-ignore
  static init(sequelize) {
    // @ts-ignore
    return super.init(
      {
        user_id: {
          primaryKey: true,
          type: DataTypes.INTEGER.UNSIGNED,
          autoIncrement: true,
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING(30),
          allowNull: false,
          unique: true,
        },
        nickname: {
          type: DataTypes.STRING(30),
          allowNull: false,
          unique: true,
        },
        password: {
          type: DataTypes.STRING(200),
          allowNull: false,
        },
        role: {
          type: DataTypes.INTEGER.UNSIGNED,
          defaultValue: 0,
        },
      },
      {
        sequelize,
        modelName: "User",
        tableName: "users",
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

export default User;
