const Sequelize = require("sequelize");
const User = require("./user");

const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.js")[env];
const db = {};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

db.sequelize = sequelize;
db.User = User;

User.init(sequelize); // User 모델의 static.init 호출 => 테이블이 모델로 연결
User.associate(db);

module.exports = db;
