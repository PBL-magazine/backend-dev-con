const Sequelize = require("sequelize");
const User = require("./user");
const Post = require("./post");
const Like = require("./like");

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
db.Post = Post;
db.Like = Like;

User.init(sequelize); // 모델의 static.init 호출 => 테이블이 모델로 연결
Post.init(sequelize);
Like.init(sequelize);

User.associate(db);
Post.associate(db);
Like.associate(db);

module.exports = db;
