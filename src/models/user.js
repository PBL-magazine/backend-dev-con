const { DataTypes, Model } = require("sequelize");

class User extends Model {
  static init(sequelize) {
    return super.init(
      {
        // TODO: 시퀄라이즈는 id를 기본키로 설정 해준다고 하니 빼봐야 겠음
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
        timestamps: false, // createdAt, updatedAt 자동생성
        paranoid: false, // deletedAt 자동생성
        underscored: true, // 테이블명, 컬럼명 스네이크 케이스 적용 여부 (false: 케멀케이스)
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }

  static associate(db) {
    db.User.hasMany(db.Post, {
      foreignKey: "user_id",
      sourceKey: "user_id",
    });
    db.User.hasMany(db.Like, {
      foreignKey: "user_id",
      sourceKey: "user_id",
    });
  }
}

module.exports = User;
